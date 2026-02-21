import pandas as pd


def clean_data(input_path, output_path):

    print("Loading dataset...")

    # Auto detect file type
    if input_path.endswith(".csv"):
        df = pd.read_csv(input_path)
    elif input_path.endswith(".xlsx"):
        df = pd.read_excel(input_path)
    else:
        raise ValueError("Unsupported file format")

    print("Initial Shape:", df.shape)

    # Standardize column names
    df.columns = df.columns.str.strip()

    # Rename target column safely
    if "delivery_status" in df.columns:
        df.rename(columns={"delivery_status": "Delivery_Status"}, inplace=True)
    elif "Delivery_Status" not in df.columns:
        raise ValueError("delivery_status column not found!")

    # Keep required columns only
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
        "Delivery_Status"
    ]

    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Missing columns: {missing_cols}")

    df = df[required_cols]

    # Remove duplicates
    df.drop_duplicates(inplace=True)

    # Remove missing values
    df.dropna(inplace=True)

    print("After Cleaning Shape:", df.shape)

    df.to_csv(output_path, index=False)
    print("Clean dataset saved successfully.")


if __name__ == "__main__":
    clean_data("Delivery_Logistics.csv", "clean_data.csv")