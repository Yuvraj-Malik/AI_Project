from pathlib import Path
import json

from .config import METRICS_PATH


DEFAULT_METRICS = {
    "models": [
        {
            "name": "RandomForestClassifier",
            "accuracy": 0.86,
            "macro_f1": 0.84,
            "weighted_f1": 0.86,
        },
        {
            "name": "GradientBoostingClassifier",
            "accuracy": 0.82,
            "macro_f1": 0.80,
            "weighted_f1": 0.82,
        },
        {
            "name": "XGBoost (Optional)",
            "accuracy": 0.88,
            "macro_f1": 0.86,
            "weighted_f1": 0.88,
        },
    ],
    "notes": "Update model_metrics.json with your latest experiment outputs before final submission.",
}


def get_metrics() -> dict:
    path = Path(METRICS_PATH)
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return DEFAULT_METRICS
