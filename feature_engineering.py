
import pandas as pd

def classify_status(delay):
    if delay <= 0:
        return "On-Time"
    elif delay <= 2:
        return "At Risk"
    else:
        return "Delayed"

def run_feature_engineering(input_path, output_path="feature_enriched_dataset.csv"):
    df = pd.read_csv(input_path)

    # Create Delivery_Status
    df["Delivery_Status"] = df["delay_hours"].apply(classify_status)

    # Warehouse Processing Time
    df["Warehouse_Processing_Time"] = (
        df["expected_time_hours"] - df["delivery_time_hours"]
    ).clip(lower=0)

    # Historical Delivery Performance
    performance = (
        df.groupby("delivery_partner")["Delivery_Status"]
        .apply(lambda x: (x == "On-Time").mean())
        .rename("Historical_OnTime_Rate")
    )

    df = df.merge(performance, on="delivery_partner", how="left")

    # Encode categorical variables
    categorical_cols = [
        "delivery_partner",
        "package_type",
        "vehicle_type",
        "delivery_mode",
        "region",
        "weather_condition",
    ]

    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    df.to_csv(output_path, index=False)
    print("Feature engineering complete. Saved to:", output_path)


if __name__ == "__main__":
    run_feature_engineering("clean_data.csv")
