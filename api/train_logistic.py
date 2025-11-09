import os
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    data_path = Path(os.environ.get("DATA_PATH", repo_root / "data" / "feedback_logit_dataset.csv"))

    df = pd.read_csv(data_path)
    y = df["decision_yes"]
    X = df.drop(columns=["decision_yes"])

    categorical = ["change_type", "module_area"]
    ordinal = ["impact_level"]
    ordinal_categories = [["Low", "Medium", "High", "Critical"]]
    numeric = [
        "affected_users_pct",
        "sentiment_score",
        "feedback_length",
        "competitor_mentions",
        "historical_bug_rate",
        "days_since_release",
        "rating_avg",
        "prior_issue_count",
        "is_mobile",
        "is_enterprise_tenant",
    ]

    preprocess = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("ord", OrdinalEncoder(categories=ordinal_categories), ordinal),
            ("num", StandardScaler(), numeric),
        ]
    )

    model = LogisticRegression(max_iter=1000, solver="lbfgs")
    pipe = Pipeline([("prep", preprocess), ("clf", model)])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )
    pipe.fit(X_train, y_train)

    y_pred = pipe.predict(X_test)
    y_prob = pipe.predict_proba(X_test)[:, 1]
    print(classification_report(y_test, y_pred, digits=3))
    print("ROC-AUC:", roc_auc_score(y_test, y_prob))

    out_path = repo_root / "api" / "logistic_feedback_model.joblib"
    joblib.dump(pipe, out_path)
    print(f"Saved model -> {out_path}")


if __name__ == "__main__":
    main()


