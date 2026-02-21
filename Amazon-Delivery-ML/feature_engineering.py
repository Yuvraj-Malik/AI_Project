import pandas as pd
import numpy as np


def feature_engineering(input_path, output_path):

    print("Loading cleaned dataset...")
    df = pd.read_csv(input_path)

    print("Initial Shape:", df.shape)

    # =====================================================
    # 1️⃣ TARGET MAPPING
    # =====================================================

    def map_status(x):
        x = str(x).lower().strip()

        if x == "delivered":
            return 0
        elif x == "delayed":
            return 2
        else:
            return 1

    df["Delivery_Status"] = df["Delivery_Status"].apply(map_status)

    print("\nMapped Target Distribution:")
    print(df["Delivery_Status"].value_counts())

    # =====================================================
    # 2️⃣ TRAFFIC PROXY
    # =====================================================

    df["Traffic_Index"] = 0

    df.loc[df["weather_condition"].isin(["stormy", "foggy", "rainy"]), "Traffic_Index"] += 2
    df.loc[df["delivery_mode"].isin(["same day"]), "Traffic_Index"] += 2
    df.loc[df["region"].isin(["central", "west"]), "Traffic_Index"] += 1

    # =====================================================
    # 3️⃣ OPERATIONAL COMPLEXITY
    # =====================================================

    df["Complexity_Score"] = (
        df["distance_km"] * 0.4 +
        df["package_weight_kg"] * 0.3 +
        df["delivery_cost"] * 0.3
    )

    # =====================================================
    # 4️⃣ INTERACTION FEATURES
    # =====================================================

    df["Distance_Weight"] = df["distance_km"] * df["package_weight_kg"]
    df["Cost_per_KM"] = df["delivery_cost"] / (df["distance_km"] + 1)
    df["Cost_per_Weight"] = df["delivery_cost"] / (df["package_weight_kg"] + 1)

    df["Log_Distance"] = np.log1p(df["distance_km"])
    df["Log_Weight"] = np.log1p(df["package_weight_kg"])
    df["Log_Cost"] = np.log1p(df["delivery_cost"])

    # =====================================================
    # 5️⃣ ENCODING
    # =====================================================

    categorical_cols = [
        "delivery_partner",
        "package_type",
        "vehicle_type",
        "delivery_mode",
        "region",
        "weather_condition"
    ]

    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # =====================================================
    # 6️⃣ CONTROLLED REAL-WORLD NOISE (10%)
    # =====================================================

    np.random.seed(42)

    noise_columns = [
        "distance_km",
        "package_weight_kg",
        "delivery_cost"
    ]

    for col in noise_columns:
        noise = np.random.normal(
            0,
            df[col].std() * 0.10,   # 10% noise now
            size=len(df)
        )
        df[col] = df[col] + noise

    # =====================================================
    # 7️⃣ FINAL CLEAN
    # =====================================================

    df.dropna(inplace=True)
    df.drop_duplicates(inplace=True)

    print("\nFinal Shape After Feature Engineering:", df.shape)

    df.to_csv(output_path, index=False)
    print("Feature dataset saved successfully.")


if __name__ == "__main__":
    feature_engineering("clean_data.csv", "feature_data.csv")