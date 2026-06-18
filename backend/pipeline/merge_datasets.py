import pandas as pd
import os

# Load datasets
patients = pd.read_csv("data/synthetic/patients.csv")
labs = pd.read_csv("data/synthetic/lab_results.csv")
diseases = pd.read_csv("data/synthetic/disease_labels.csv")

symptoms = pd.read_csv("data/synthetic/symptoms.csv")
history = pd.read_csv("data/synthetic/medical_history.csv")

print(symptoms.dtypes)
print(history.dtypes)

# Convert multiple symptoms into one row per patient
symptoms_grouped = (
    symptoms.groupby("patient_id", as_index=False)
    .agg({"symptom": lambda x: ", ".join(map(str, x))})
)

# Convert medical history into one row per patient
history_grouped = (
    history.groupby("patient_id", as_index=False)
    .agg({"condition": lambda x: ", ".join(map(str, x))})
)

# Merge datasets
master = patients.merge(
    symptoms_grouped,
    on="patient_id",
    how="left"
)

master = master.merge(
    history_grouped,
    on="patient_id",
    how="left"
)

master = master.merge(
    labs,
    on="patient_id",
    how="left"
)

master = master.merge(
    diseases,
    on="patient_id",
    how="left"
)

# Create output folder
os.makedirs("data/processed", exist_ok=True)

# Save final dataset
master.to_csv(
    "data/processed/master_patient_dataset.csv",
    index=False
)

print("✅ Master Dataset Created Successfully!")
print("\nShape:", master.shape)
print("\nColumns:")
print(master.columns.tolist())
print("\nPreview:")
print(master.head())