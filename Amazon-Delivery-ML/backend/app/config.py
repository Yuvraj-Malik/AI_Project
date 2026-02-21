from pathlib import Path
import os


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "final_model.pkl"
FEATURE_DATA_PATH = BASE_DIR / "data" / "feature_data.csv"
CLEAN_DATA_PATH = BASE_DIR / "data" / "clean_data.csv"
BALANCED_TRAIN_PATH = BASE_DIR / "data" / "train_test_data" / "balanced_train.csv"
METRICS_PATH = BASE_DIR / "backend" / "app" / "artifacts" / "model_metrics.json"
HISTORY_DB_PATH = BASE_DIR / "backend" / "app" / "artifacts" / "history.db"

JWT_SECRET = os.getenv("JWT_SECRET", "amazon-supply-chain-intelligence-secret")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))

DEMO_USER = os.getenv("APP_DEMO_USER", "admin")
DEMO_PASSWORD = os.getenv("APP_DEMO_PASS", "admin123")

CLASS_MAP = {
    0: "On-Time",
    1: "At Risk",
    2: "Delayed",
}
