"""
Django management command to train XGBoost sentiment analysis model
"""
import os
import pandas as pd
import numpy as np
from django.core.management.base import BaseCommand
from django.conf import settings
from pathlib import Path
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import warnings
warnings.filterwarnings('ignore')

class Command(BaseCommand):
    help = 'Train XGBoost sentiment analysis model on feedback dataset'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dataset',
            type=str,
            default='feedback_logit_dataset.xlsx',
            help='Path to the feedback dataset Excel file'
        )
        parser.add_argument(
            '--model-path',
            type=str,
            default='api/services/sentiment_model.pkl',
            help='Path to save the trained model'
        )
        parser.add_argument(
            '--target',
            type=str,
            default='sentiment_score',
            help='Target variable to predict (sentiment_score or decision_yes)'
        )

    def handle(self, *args, **options):
        dataset_path = options['dataset']
        model_path = options['model_path']
        target_var = options['target']

        self.stdout.write(self.style.SUCCESS(f'Loading dataset from {dataset_path}...'))
        
        # Load dataset
        if not os.path.exists(dataset_path):
            self.stdout.write(self.style.ERROR(f'Dataset file not found: {dataset_path}'))
            return

        try:
            df = pd.read_excel(dataset_path)
            self.stdout.write(self.style.SUCCESS(f'Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error loading dataset: {e}'))
            return

        # Check if target variable exists
        if target_var not in df.columns:
            self.stdout.write(self.style.ERROR(f'Target variable "{target_var}" not found in dataset'))
            self.stdout.write(self.style.WARNING(f'Available columns: {list(df.columns)}'))
            return

        self.stdout.write(self.style.SUCCESS(f'Preprocessing data...'))
        
        # Prepare features and target
        # Exclude target and non-numeric columns that shouldn't be features
        exclude_cols = [target_var]
        
        # Separate numeric and categorical columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        
        # Remove target from numeric columns
        if target_var in numeric_cols:
            numeric_cols.remove(target_var)
        if target_var in categorical_cols:
            categorical_cols.remove(target_var)

        # Prepare feature columns
        feature_cols = numeric_cols.copy()
        
        # Encode categorical variables
        label_encoders = {}
        for col in categorical_cols:
            if col not in exclude_cols:
                le = LabelEncoder()
                df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
                feature_cols.append(col + '_encoded')
                label_encoders[col] = le

        # Handle missing values
        df[feature_cols] = df[feature_cols].fillna(df[feature_cols].median())
        
        # Prepare X and y
        X = df[feature_cols].values
        y = df[target_var].values

        # Check if target is categorical or numeric
        if df[target_var].dtype == 'object' or df[target_var].dtype.name == 'category':
            # Classification problem
            le_target = LabelEncoder()
            y = le_target.fit_transform(y)
            is_classification = True
            self.stdout.write(self.style.SUCCESS(f'Classification problem with {len(le_target.classes_)} classes'))
        else:
            # Regression problem - normalize to 0-100 scale if needed
            if y.max() > 100 or y.min() < 0:
                y_min, y_max = y.min(), y.max()
                if y_max > y_min:
                    y = ((y - y_min) / (y_max - y_min)) * 100
                self.stdout.write(self.style.SUCCESS(f'Regression problem - normalized to 0-100 scale'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Regression problem - already in 0-100 scale'))
            is_classification = False

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y if is_classification else None
        )

        self.stdout.write(self.style.SUCCESS(f'Training XGBoost model...'))
        
        # Train model
        if is_classification:
            model = xgb.XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                eval_metric='mlogloss'
            )
        else:
            model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                eval_metric='rmse'
            )

        model.fit(X_train, y_train)

        # Evaluate model
        y_pred = model.predict(X_test)
        
        if is_classification:
            accuracy = accuracy_score(y_test, y_pred)
            self.stdout.write(self.style.SUCCESS(f'Test Accuracy: {accuracy:.4f}'))
            self.stdout.write(self.style.SUCCESS(f'\nClassification Report:\n{classification_report(y_test, y_pred)}'))
        else:
            mse = np.mean((y_test - y_pred) ** 2)
            rmse = np.sqrt(mse)
            mae = np.mean(np.abs(y_test - y_pred))
            self.stdout.write(self.style.SUCCESS(f'Test RMSE: {rmse:.4f}'))
            self.stdout.write(self.style.SUCCESS(f'Test MAE: {mae:.4f}'))

        # Save model and metadata
        model_dir = Path(model_path).parent
        model_dir.mkdir(parents=True, exist_ok=True)

        model_data = {
            'model': model,
            'feature_cols': feature_cols,
            'label_encoders': label_encoders,
            'target_var': target_var,
            'is_classification': is_classification,
            'le_target': le_target if is_classification else None
        }

        joblib.dump(model_data, model_path)
        self.stdout.write(self.style.SUCCESS(f'Model saved to {model_path}'))

        self.stdout.write(self.style.SUCCESS('\nModel training completed successfully!'))

