import numpy as np
import pandas as pd


FEATURE_COLUMNS = [
    "distance_km",
    "package_weight_kg",
    "delivery_rating",
    "delivery_cost",
    "Traffic_Index",
    "Complexity_Score",
    "Distance_Weight",
    "Cost_per_KM",
    "Cost_per_Weight",
    "Log_Distance",
    "Log_Weight",
    "Log_Cost",
    "delivery_partner_blue dart",
    "delivery_partner_delhivery",
    "delivery_partner_dhl",
    "delivery_partner_ecom express",
    "delivery_partner_ekart",
    "delivery_partner_fedex",
    "delivery_partner_shadowfax",
    "delivery_partner_xpressbees",
    "package_type_clothing",
    "package_type_cosmetics",
    "package_type_documents",
    "package_type_electronics",
    "package_type_fragile items",
    "package_type_furniture",
    "package_type_groceries",
    "package_type_pharmacy",
    "vehicle_type_ev bike",
    "vehicle_type_ev van",
    "vehicle_type_scooter",
    "vehicle_type_truck",
    "vehicle_type_van",
    "delivery_mode_same day",
    "delivery_mode_standard",
    "delivery_mode_two day",
    "region_east",
    "region_north",
    "region_south",
    "region_west",
    "weather_condition_cold",
    "weather_condition_foggy",
    "weather_condition_hot",
    "weather_condition_rainy",
    "weather_condition_stormy",
]


def _traffic_index(payload: dict) -> int:
    traffic = 0
    if payload["weather_condition"] in ["stormy", "foggy", "rainy"]:
        traffic += 2
    if payload["delivery_mode"] == "same day":
        traffic += 2
    if payload["region"] in ["central", "west"]:
        traffic += 1
    return traffic


def _with_engineered_features(payload: dict) -> dict:
    distance_km = payload["distance_km"]
    package_weight_kg = payload["package_weight_kg"]
    delivery_cost = payload["delivery_cost"]

    payload["Traffic_Index"] = _traffic_index(payload)
    payload["Complexity_Score"] = (
        distance_km * 0.4 + package_weight_kg * 0.3 + delivery_cost * 0.3
    )
    payload["Distance_Weight"] = distance_km * package_weight_kg
    payload["Cost_per_KM"] = delivery_cost / (distance_km + 1)
    payload["Cost_per_Weight"] = delivery_cost / (package_weight_kg + 1)
    payload["Log_Distance"] = float(np.log1p(distance_km))
    payload["Log_Weight"] = float(np.log1p(package_weight_kg))
    payload["Log_Cost"] = float(np.log1p(delivery_cost))
    return payload


def build_feature_frame(raw_payload: dict) -> pd.DataFrame:
    payload = _with_engineered_features(dict(raw_payload))
    row = {feature: 0 for feature in FEATURE_COLUMNS}

    for num_col in [
        "distance_km",
        "package_weight_kg",
        "delivery_rating",
        "delivery_cost",
        "Traffic_Index",
        "Complexity_Score",
        "Distance_Weight",
        "Cost_per_KM",
        "Cost_per_Weight",
        "Log_Distance",
        "Log_Weight",
        "Log_Cost",
    ]:
        row[num_col] = payload[num_col]

    category_to_col = {
        "delivery_partner": [
            "delivery_partner_blue dart",
            "delivery_partner_delhivery",
            "delivery_partner_dhl",
            "delivery_partner_ecom express",
            "delivery_partner_ekart",
            "delivery_partner_fedex",
            "delivery_partner_shadowfax",
            "delivery_partner_xpressbees",
        ],
        "package_type": [
            "package_type_clothing",
            "package_type_cosmetics",
            "package_type_documents",
            "package_type_electronics",
            "package_type_fragile items",
            "package_type_furniture",
            "package_type_groceries",
            "package_type_pharmacy",
        ],
        "vehicle_type": [
            "vehicle_type_ev bike",
            "vehicle_type_ev van",
            "vehicle_type_scooter",
            "vehicle_type_truck",
            "vehicle_type_van",
        ],
        "delivery_mode": [
            "delivery_mode_same day",
            "delivery_mode_standard",
            "delivery_mode_two day",
        ],
        "region": ["region_east", "region_north", "region_south", "region_west"],
        "weather_condition": [
            "weather_condition_cold",
            "weather_condition_foggy",
            "weather_condition_hot",
            "weather_condition_rainy",
            "weather_condition_stormy",
        ],
    }

    for field, columns in category_to_col.items():
        selected = f"{field}_{payload[field]}"
        if selected in columns:
            row[selected] = 1

    frame = pd.DataFrame([row], columns=FEATURE_COLUMNS)
    return frame
