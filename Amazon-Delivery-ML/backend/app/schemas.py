from typing import Literal
from pydantic import BaseModel, Field


DeliveryPartner = Literal[
    "amazon logistics",
    "blue dart",
    "delhivery",
    "dhl",
    "ecom express",
    "ekart",
    "fedex",
    "shadowfax",
    "xpressbees",
]

PackageType = Literal[
    "automobile parts",
    "clothing",
    "cosmetics",
    "documents",
    "electronics",
    "fragile items",
    "furniture",
    "groceries",
    "pharmacy",
]

VehicleType = Literal["bike", "ev bike", "ev van", "scooter", "truck", "van"]
DeliveryMode = Literal["express", "same day", "standard", "two day"]
Region = Literal["central", "east", "north", "south", "west"]
Weather = Literal["clear", "cold", "foggy", "hot", "rainy", "stormy"]


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PredictRequest(BaseModel):
    delivery_partner: DeliveryPartner
    package_type: PackageType
    vehicle_type: VehicleType
    delivery_mode: DeliveryMode
    region: Region
    weather_condition: Weather
    distance_km: float = Field(gt=0, le=5000)
    package_weight_kg: float = Field(gt=0, le=200)
    delivery_rating: float = Field(ge=1, le=5)
    delivery_cost: float = Field(gt=0, le=200000)


class PredictResponse(BaseModel):
    predicted_class_id: int
    predicted_label: str
    confidence: float
    probabilities: dict[str, float]
