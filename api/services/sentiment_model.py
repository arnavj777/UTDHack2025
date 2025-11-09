"""
Sentiment analysis model service for loading and using trained XGBoost model
"""
import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from django.conf import settings
import warnings
warnings.filterwarnings('ignore')

class SentimentModelService:
    """Service for sentiment analysis using trained XGBoost model"""
    
    def __init__(self, model_path=None):
        """
        Initialize the sentiment model service
        
        Args:
            model_path: Path to the trained model file. If None, uses default path.
        """
        if model_path is None:
            # Default model path relative to project root
            base_dir = Path(__file__).resolve().parent.parent.parent
            model_path = base_dir / 'api' / 'services' / 'sentiment_model.pkl'
        
        self.model_path = Path(model_path)
        self.model = None
        self.feature_cols = None
        self.label_encoders = None
        self.target_var = None
        self.is_classification = None
        self.le_target = None
        self._load_model()
    
    def _load_model(self):
        """Load the trained model from disk"""
        if not self.model_path.exists():
            # Model not trained yet, will use fallback method
            print(f"Model file not found: {self.model_path}. Using fallback sentiment analysis.")
            self.model = None
            return
        
        try:
            model_data = joblib.load(self.model_path)
            self.model = model_data['model']
            self.feature_cols = model_data['feature_cols']
            self.label_encoders = model_data.get('label_encoders', {})
            self.target_var = model_data.get('target_var', 'sentiment_score')
            self.is_classification = model_data.get('is_classification', False)
            self.le_target = model_data.get('le_target', None)
            print(f"Sentiment model loaded successfully from {self.model_path}")
        except Exception as e:
            print(f"Error loading model: {e}. Using fallback sentiment analysis.")
            self.model = None
    
    def predict_sentiment(self, text, additional_features=None):
        """
        Predict sentiment score from text and optional additional features
        
        Args:
            text: Input text to analyze
            additional_features: Dictionary of additional feature values
                               (e.g., {'feedback_length': 100, 'is_mobile': 1})
        
        Returns:
            float: Sentiment score (0-100)
        """
        if self.model is None:
            # If model not loaded, use simple text-based sentiment analysis
            return self._simple_sentiment_analysis(text)
        
        try:
            # Extract features from text
            features = self._extract_features(text, additional_features)
            
            # Prepare feature vector
            feature_vector = self._prepare_feature_vector(features)
            
            # Make prediction
            prediction = self.model.predict(feature_vector)[0]
            
            # Handle classification vs regression
            if self.is_classification:
                # For classification, convert class to score
                # Assuming classes are ordered (negative=0, neutral=1, positive=2)
                if self.le_target is not None:
                    # Map class to score (0-100)
                    num_classes = len(self.le_target.classes_)
                    if num_classes == 2:
                        # Binary: 0 -> 30, 1 -> 70
                        score = 30 if prediction == 0 else 70
                    elif num_classes == 3:
                        # Ternary: 0 -> 20, 1 -> 50, 2 -> 80
                        score = 20 + (prediction * 30)
                    else:
                        # Multi-class: map linearly to 0-100
                        score = (prediction / (num_classes - 1)) * 100
                else:
                    score = prediction * 50  # Default mapping
            else:
                # Regression: ensure score is in 0-100 range
                score = max(0, min(100, prediction))
            
            return float(score)
        except Exception as e:
            # Fallback to simple sentiment analysis if model prediction fails
            print(f"Error in model prediction: {e}")
            return self._simple_sentiment_analysis(text)
    
    def _extract_features(self, text, additional_features=None):
        """
        Extract features from text and additional features
        
        Args:
            text: Input text
            additional_features: Dictionary of additional features
        
        Returns:
            dict: Feature dictionary
        """
        features = {}
        
        # Text-based features
        features['feedback_length'] = len(text) if text else 0
        features['word_count'] = len(text.split()) if text else 0
        
        # Additional features from user input
        if additional_features:
            for key, value in additional_features.items():
                features[key] = value
        
        # Set default values for missing features
        default_features = {
            'change_type': 'unknown',
            'module_area': 'unknown',
            'impact_level': 0,
            'affected_users_pct': 0,
            'competitor_mentions': 0,
            'historical_bug_rate': 0,
            'days_since_release': 0,
            'rating_avg': 0,
            'prior_issue_count': 0,
            'is_mobile': 0,
            'is_enterprise_tenant': 0
        }
        
        for key, default_value in default_features.items():
            if key not in features:
                features[key] = default_value
        
        return features
    
    def _prepare_feature_vector(self, features):
        """
        Prepare feature vector for model prediction
        
        Args:
            features: Dictionary of features
        
        Returns:
            numpy array: Feature vector
        """
        if self.feature_cols is None:
            raise Exception("Feature columns not loaded")
        
        # Create feature vector in the same order as training
        feature_vector = []
        
        for col in self.feature_cols:
            if col.endswith('_encoded'):
                # Categorical feature - use encoder
                original_col = col.replace('_encoded', '')
                if original_col in self.label_encoders:
                    value = features.get(original_col, 'unknown')
                    try:
                        # Try to transform, if value not seen, use most common
                        encoded_value = self.label_encoders[original_col].transform([str(value)])[0]
                    except ValueError:
                        # Unknown value - use 0 as default
                        encoded_value = 0
                    feature_vector.append(encoded_value)
                else:
                    feature_vector.append(0)
            else:
                # Numeric feature
                value = features.get(col, 0)
                try:
                    feature_vector.append(float(value))
                except (ValueError, TypeError):
                    feature_vector.append(0.0)
        
        # Convert to numpy array and reshape for single prediction
        feature_array = np.array(feature_vector).reshape(1, -1)
        
        return feature_array
    
    def _simple_sentiment_analysis(self, text):
        """
        Simple fallback sentiment analysis using keyword matching
        Used when model is not available
        
        Args:
            text: Input text
        
        Returns:
            float: Sentiment score (0-100)
        """
        if not text:
            return 50.0
        
        text_lower = text.lower()
        
        # Positive keywords
        positive_keywords = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
            'love', 'like', 'best', 'perfect', 'awesome', 'brilliant',
            'helpful', 'useful', 'easy', 'simple', 'clear', 'intuitive',
            'improve', 'better', 'enhance', 'upgrade', 'feature', 'benefit'
        ]
        
        # Negative keywords
        negative_keywords = [
            'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor',
            'hate', 'dislike', 'difficult', 'complex', 'confusing', 'unclear',
            'bug', 'error', 'issue', 'problem', 'broken', 'fails',
            'missing', 'lack', 'slow', 'crashes', 'unstable'
        ]
        
        # Count positive and negative matches
        positive_count = sum(1 for keyword in positive_keywords if keyword in text_lower)
        negative_count = sum(1 for keyword in negative_keywords if keyword in text_lower)
        
        # Calculate score
        if positive_count == 0 and negative_count == 0:
            return 50.0  # Neutral
        
        total = positive_count + negative_count
        positive_ratio = positive_count / total
        
        # Map to 0-100 scale (0.5 ratio = 50, 1.0 ratio = 80, 0.0 ratio = 20)
        score = 20 + (positive_ratio * 60)
        
        return float(max(0, min(100, score)))


# Singleton instance
_sentiment_model_service = None

def get_sentiment_model_service():
    """Get or create singleton instance of SentimentModelService"""
    global _sentiment_model_service
    if _sentiment_model_service is None:
        try:
            _sentiment_model_service = SentimentModelService()
        except Exception as e:
            # If initialization fails, create a minimal service instance that uses fallback
            print(f"Warning: Could not initialize sentiment model service: {e}")
            # Create a service instance that will use fallback sentiment analysis
            base_dir = Path(__file__).resolve().parent.parent.parent
            model_path = base_dir / 'api' / 'services' / 'sentiment_model.pkl'
            _sentiment_model_service = SentimentModelService(model_path=model_path)
    return _sentiment_model_service

