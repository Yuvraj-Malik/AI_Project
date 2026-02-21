from pathlib import Path
import json

import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split

from .config import FEATURE_DATA_PATH, METRICS_PATH


def _scores(y_true, y_pred) -> dict:
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "macro_f1": round(float(f1_score(y_true, y_pred, average="macro")), 4),
        "weighted_f1": round(float(f1_score(y_true, y_pred, average="weighted")), 4),
    }


def generate_metrics() -> dict:
    df = pd.read_csv(FEATURE_DATA_PATH)

    X = df.drop("Delivery_Status", axis=1)
    y = df["Delivery_Status"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=42,
    )

    models = [
        (
            "RandomForestClassifier",
            RandomForestClassifier(
                n_estimators=100,
                max_depth=5,
                min_samples_leaf=15,
                random_state=42,
                n_jobs=-1,
            ),
        ),
        ("GradientBoostingClassifier", GradientBoostingClassifier(random_state=42)),
        (
            "LogisticRegression",
            LogisticRegression(max_iter=1000, multi_class="auto", n_jobs=None),
        ),
    ]

    output = {"models": [], "notes": "Generated from backend/app/generate_metrics.py"}

    for name, model in models:
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        output["models"].append({"name": name, **_scores(y_test, predictions)})

    metrics_path = Path(METRICS_PATH)
    metrics_path.parent.mkdir(parents=True, exist_ok=True)
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    return output


if __name__ == "__main__":
    result = generate_metrics()
    print("Saved metrics to:", METRICS_PATH)
    print(result)
