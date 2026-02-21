from io import StringIO

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from .config import DEMO_PASSWORD, DEMO_USER, MODEL_PATH
from .database import fetch_history, init_db, insert_history
from .dependencies import get_current_user
from .insights_service import (
    get_about_model,
    get_analytics_data,
    get_dashboard_overview,
    predict_from_business_inputs,
    get_report_summary,
    process_uploaded_dataset,
)
from .metrics_service import get_metrics
from .predictor import load_model, predict
from .schemas import LoginRequest, PredictRequest, PredictResponse, TokenResponse
from .security import create_access_token, verify_password


app = FastAPI(
    title="Amazon Supply Chain Intelligence API",
    version="1.0.0",
    description="FastAPI backend for Delivery Delay Risk multi-class classification",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    if not MODEL_PATH.exists():
        raise RuntimeError(f"Model file not found at: {MODEL_PATH}")
    load_model()
    init_db()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "amazon-supply-chain-intelligence"}


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    if payload.username != DEMO_USER:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(payload.password, DEMO_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(payload.username)
    return TokenResponse(access_token=token)


@app.post("/api/predict", response_model=PredictResponse)
def predict_one(
    payload: PredictRequest,
    username: str = Depends(get_current_user),
) -> PredictResponse:
    result = predict(payload.model_dump())
    insert_history(
        username=username,
        request_payload=payload.model_dump(),
        prediction_label=result["predicted_label"],
        prediction_id=result["predicted_class_id"],
        confidence=result["confidence"],
    )
    return PredictResponse(**result)


@app.post("/api/predict/live")
def predict_live(
    payload: dict,
    username: str = Depends(get_current_user),
) -> dict:
    result = predict_from_business_inputs(payload)
    insert_history(
        username=username,
        request_payload=payload,
        prediction_label=result["predicted_label"],
        prediction_id=result["predicted_class_id"],
        confidence=result["confidence"],
    )
    return result


@app.post("/api/predict/batch")
def predict_batch(
    file: UploadFile = File(...),
    username: str = Depends(get_current_user),
) -> dict:
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = file.file.read().decode("utf-8")
    df = pd.read_csv(StringIO(content))

    required_cols = [
        "delivery_partner",
        "package_type",
        "vehicle_type",
        "delivery_mode",
        "region",
        "weather_condition",
        "distance_km",
        "package_weight_kg",
        "delivery_rating",
        "delivery_cost",
    ]
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    output_rows = []
    for _, row in df.iterrows():
        raw = {
            "delivery_partner": str(row["delivery_partner"]).lower().strip(),
            "package_type": str(row["package_type"]).lower().strip(),
            "vehicle_type": str(row["vehicle_type"]).lower().strip(),
            "delivery_mode": str(row["delivery_mode"]).lower().strip(),
            "region": str(row["region"]).lower().strip(),
            "weather_condition": str(row["weather_condition"]).lower().strip(),
            "distance_km": float(row["distance_km"]),
            "package_weight_kg": float(row["package_weight_kg"]),
            "delivery_rating": float(row["delivery_rating"]),
            "delivery_cost": float(row["delivery_cost"]),
        }
        validated = PredictRequest(**raw)
        result = predict(validated.model_dump())

        insert_history(
            username=username,
            request_payload=validated.model_dump(),
            prediction_label=result["predicted_label"],
            prediction_id=result["predicted_class_id"],
            confidence=result["confidence"],
        )

        output_rows.append(
            {
                **validated.model_dump(),
                **result,
            }
        )

    return {
        "count": len(output_rows),
        "results": output_rows,
    }


@app.get("/api/metrics")
def metrics(username: str = Depends(get_current_user)) -> dict:
    return get_metrics()


@app.get("/api/history")
def history(limit: int = 100, username: str = Depends(get_current_user)) -> dict:
    _ = username
    return {"items": fetch_history(limit=limit)}


@app.get("/api/dashboard/overview")
def dashboard_overview(username: str = Depends(get_current_user)) -> dict:
    _ = username
    return get_dashboard_overview()


@app.get("/api/analytics")
def analytics(username: str = Depends(get_current_user)) -> dict:
    _ = username
    return get_analytics_data()


@app.post("/api/upload-data")
def upload_data(
    file: UploadFile = File(...),
    username: str = Depends(get_current_user),
) -> dict:
    _ = username
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    content = file.file.read().decode("utf-8")
    try:
        return process_uploaded_dataset(content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/about-model")
def about_model(username: str = Depends(get_current_user)) -> dict:
    _ = username
    return get_about_model()


@app.get("/api/reports/summary")
def reports_summary(username: str = Depends(get_current_user)) -> dict:
    _ = username
    return get_report_summary()
