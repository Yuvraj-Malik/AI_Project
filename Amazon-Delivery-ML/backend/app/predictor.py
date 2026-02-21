from functools import lru_cache
import joblib

from .config import MODEL_PATH, CLASS_MAP
from .preprocessing import build_feature_frame


@lru_cache
def load_model():
    return joblib.load(MODEL_PATH)


def predict(raw_payload: dict) -> dict:
    model = load_model()
    feature_frame = build_feature_frame(raw_payload)

    predicted = int(model.predict(feature_frame)[0])
    probabilities_array = model.predict_proba(feature_frame)[0]

    probabilities = {
        CLASS_MAP[index]: float(probabilities_array[index])
        for index in range(len(probabilities_array))
    }
    confidence = float(max(probabilities_array))

    return {
        "predicted_class_id": predicted,
        "predicted_label": CLASS_MAP[predicted],
        "confidence": confidence,
        "probabilities": probabilities,
    }
