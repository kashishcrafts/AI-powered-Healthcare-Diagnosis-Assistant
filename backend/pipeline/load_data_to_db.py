import pandas as pd
import sqlite3

# Connect database
conn = sqlite3.connect(
    "database/healthcare.db"
)

# Load CSV files
patients = pd.read_csv(
    "data/synthetic/patients.csv"
)

labs = pd.read_csv(
    "data/synthetic/lab_results.csv"
)

master = pd.read_csv(
    "data/processed/master_patient_dataset.csv"
)

# Insert into tables

patients.to_sql(
    "patients",
    conn,
    if_exists="replace",
    index=False
)

labs.to_sql(
    "lab_results",
    conn,
    if_exists="replace",
    index=False
)

master[
    [
        "patient_id",
        "disease",
        "Risk_Score",
        "Risk_Level"
    ]
].to_sql(
    "diagnosis",
    conn,
    if_exists="replace",
    index=False
)

conn.commit()
conn.close()

print("✅ Data Loaded Successfully")