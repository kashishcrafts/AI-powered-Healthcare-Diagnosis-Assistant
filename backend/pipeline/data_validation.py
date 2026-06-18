import pandas as pd

df = pd.read_csv(
    "data/processed/master_patient_dataset.csv"
)

print("\n============================")
print("DATA VALIDATION REPORT")
print("============================\n")

# Missing values
print("Missing Values:")
print(df.isnull().sum())

# Duplicate patients
duplicates = df.duplicated().sum()

print("\nDuplicate Records:")
print(duplicates)

# Invalid ages
invalid_age = df[
    (df["age"] < 0) |
    (df["age"] > 120)
]

print("\nInvalid Ages:")
print(len(invalid_age))

# Invalid blood sugar
invalid_sugar = df[
    (df["blood_sugar"] < 0)
]

print("\nInvalid Blood Sugar Records:")
print(len(invalid_sugar))

print("\nDataset Shape:")
print(df.shape)

print("\nValidation Complete ✅")