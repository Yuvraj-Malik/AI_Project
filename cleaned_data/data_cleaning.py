# Amazon Delivery Data Cleaning (Member 1)
import pandas as pd
import numpy as np

# LOAD DATA
df = pd.read_csv("raw_data/deliveries.csv")
original_rows = df.shape[0]

# 1. STANDARDIZE COLUMN NAMES (Crucial for team integration)
# Ensure everyone uses snake_case so Member 2 & 3 don't break
df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]

# 2. SEPARATE COLUMNS
num_cols = [
    'distance_km', 'package_weight_kg', 'delivery_time_hours', 
    'expected_time_hours', 'delivery_cost', 'agent_age', 'agent_rating'
]

cat_cols = [
    'delivery_partner', 'vehicle_type', 'delivery_mode', 
    'region', 'weather_condition', 'traffic_level' # Added Traffic
]

# 3. FIX NUMERIC IMPUTATION (Use Median, not Mode)
for col in num_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        # Use Median for robustness against outliers
        df[col] = df[col].fillna(df[col].median()) 

# 4. FIX CATEGORICAL IMPUTATION
for col in cat_cols:
    if col in df.columns:
        df[col] = df[col].astype(str).str.lower().str.strip()
        df[col] = df[col].fillna("unknown")

# 5. CLEAN WEATHER & TRAFFIC (Don't delete rare values, just normalize)
# We map similar terms to reduce noise without losing the "event"
weather_mapping = {
    'stormy': 'stormy', 'sandstorms': 'stormy', 'windy': 'windy',
    'sunny': 'clear', 'clear': 'clear', 'fog': 'foggy', 'foggy': 'foggy'
}
if 'weather_condition' in df.columns:
    df['weather_condition'] = df['weather_condition'].map(weather_mapping).fillna(df['weather_condition'])

# 6. HANDLE OUTLIERS (Capping)
def cap_outliers(column):
    if column not in df.columns: return
    Q1 = df[column].quantile(0.05) # Relaxed to 5th percentile
    Q3 = df[column].quantile(0.95) # Relaxed to 95th percentile
    
    # Cap values outside the 5th-95th range
    df[column] = np.where(df[column] < Q1, Q1, df[column])
    df[column] = np.where(df[column] > Q3, Q3, df[column])

for col in ['distance_km', 'delivery_time_hours']:
    cap_outliers(col)

# 7. SAVE (Do not add new features like 'delay_hours' here)
# Leave feature creation for Member 2 to ensure work separation.
df.to_csv("cleaned_data/clean_data.csv", index=False)

print(f"Data Cleaned! Rows: {len(df)} (Original: {original_rows})")
print("Ready for Member 2 (Feature Engineering)")