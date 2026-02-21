import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE


def handle_imbalance(input_path):

    print("Loading feature dataset...")
    df = pd.read_csv(input_path)

    print("Original Class Distribution:")
    print(df["Delivery_Status"].value_counts())

    X = df.drop("Delivery_Status", axis=1)
    y = df["Delivery_Status"]

    # Split FIRST (important)
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=42
    )

    print("\nTraining Set Distribution (Before SMOTE):")
    print(y_train.value_counts())

    # Apply SMOTE only on training
    smote = SMOTE(random_state=42)
    X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)

    print("\nTraining Set Distribution (After SMOTE):")
    print(pd.Series(y_train_bal).value_counts())

    # Save balanced training data
    balanced_train = pd.concat(
        [pd.DataFrame(X_train_bal), pd.Series(y_train_bal, name="Delivery_Status")],
        axis=1
    )

    balanced_train.to_csv("balanced_train.csv", index=False)

    # Save test separately
    test_data = pd.concat(
        [X_test, y_test],
        axis=1
    )

    test_data.to_csv("test_data.csv", index=False)

    print("\nBalanced training data saved.")
    print("Test data saved.")


if __name__ == "__main__":
    handle_imbalance("feature_data.csv")