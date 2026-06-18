import pandas as pd
import random
import os

patients = pd.read_csv("data/synthetic/patients.csv")

conditions = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Heart Disease",
    "Kidney Disease",
    "Liver Disease",
    "Thyroid Disorder",
    "None"
]

history_data = []

for _, patient in patients.iterrows():

    num_conditions = random.randint(1, 3)

    selected = random.sample(
        conditions,
        num_conditions
    )

    for condition in selected:

        history_data.append({
            "patient_id": patient["patient_id"],
            "condition": condition
        })

df = pd.DataFrame(history_data)

os.makedirs("data/synthetic", exist_ok=True)

df.to_csv(
    "data/synthetic/medical_history.csv",
    index=False
)

print("✅ Medical History Dataset Generated!")
print(df.head())