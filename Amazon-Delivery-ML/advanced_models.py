import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score


def advanced():

    print("Loading feature dataset...")
    df = pd.read_csv("feature_data.csv")

    X = df.drop("Delivery_Status", axis=1)
    y = df["Delivery_Status"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        stratify=y,
        random_state=42
    )

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=5,        # ✅ FINAL DEPTH
        min_samples_leaf=15,
        random_state=42,
        n_jobs=-1
    )

    print("\nRunning 5-Fold Cross Validation...")
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    print("Average CV Accuracy:", np.mean(cv_scores))

    print("\nTraining Final Model...")
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    final_acc = accuracy_score(y_test, preds)

    print("\nFinal Test Accuracy:", final_acc)
    print("\nClassification Report:")
    print(classification_report(y_test, preds))

    joblib.dump(model, "final_model.pkl")
    print("\nModel saved as final_model.pkl")


if __name__ == "__main__":
    advanced()