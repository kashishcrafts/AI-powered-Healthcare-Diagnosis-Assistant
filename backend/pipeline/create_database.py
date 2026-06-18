import sqlite3

conn = sqlite3.connect(
    "database/healthcare.db"
)

cursor = conn.cursor()

# Patients Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER PRIMARY KEY,
    name TEXT,
    age INTEGER,
    gender TEXT,
    height_cm REAL,
    weight_kg REAL,
    blood_group TEXT
)
""")

# Lab Results Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS lab_results (
    patient_id INTEGER,
    hemoglobin REAL,
    blood_sugar REAL,
    cholesterol REAL,
    wbc_count INTEGER,
    creatinine REAL,
    systolic_bp INTEGER,
    diastolic_bp INTEGER
)
""")

# Diagnosis Table
cursor.execute("""
CREATE TABLE IF NOT EXISTS diagnosis (
    patient_id INTEGER,
    disease TEXT,
    risk_score INTEGER,
    risk_level TEXT
)
""")

conn.commit()
conn.close()

print("✅ Healthcare Database Created Successfully")