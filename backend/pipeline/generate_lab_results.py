import pandas as pd
import random
import os

patients = pd.read_csv("data/synthetic/patients.csv")

lab_results = []

for _, patient in patients.iterrows():

    lab_results.append({
        "patient_id": patient["patient_id"],
        "hemoglobin": round(random.uniform(8.0, 18.0), 1),
        "blood_sugar": random.randint(70, 300),
        "cholesterol": random.randint(120, 350),
        "wbc_count": random.randint(4000, 15000),
        "creatinine": round(random.uniform(0.5, 3.5), 2),
        "systolic_bp": random.randint(90, 180),
        "diastolic_bp": random.randint(60, 120)
    })

df = pd.DataFrame(lab_results)

os.makedirs("data/synthetic", exist_ok=True)

df.to_csv(
    "data/synthetic/lab_results.csv",
    index=False
)

print("✅ Lab Results Dataset Generated!")
print(df.head())