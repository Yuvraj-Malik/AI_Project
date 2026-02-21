import pandas as pd
import joblib

def predict():

    print("Loading trained model...")
    model = joblib.load("final_model.pkl")

    df = pd.read_csv("feature_data.csv")
    X = df.drop("Delivery_Status", axis=1)

    predictions = model.predict(X)

    df["Predicted_Status"] = predictions

    df.to_csv("final_predictions.csv", index=False)

    print("Predictions saved as final_predictions.csv")


if __name__ == "__main__":
    predict()