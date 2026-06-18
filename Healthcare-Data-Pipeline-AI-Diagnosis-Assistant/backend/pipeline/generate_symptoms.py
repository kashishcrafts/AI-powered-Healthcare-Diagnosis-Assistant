import pandas as pd
import random
import os

patients = pd.read_csv("data/synthetic/patients.csv")

symptom_list = [
    "Fever",
    "Cough",
    "Headache",
    "Fatigue",
    "Chest Pain",
    "Shortness of Breath",
    "Nausea",
    "Vomiting",
    "Dizziness",
    "Body Pain"
]

symptoms_data = []

for _, patient in patients.iterrows():

    num_symptoms = random.randint(1, 5)

    selected_symptoms = random.sample(
        symptom_list,
        num_symptoms
    )

    for symptom in selected_symptoms:

        symptoms_data.append({
            "patient_id": patient["patient_id"],
            "symptom": symptom,
            "severity": random.randint(1, 10)
        })

df = pd.DataFrame(symptoms_data)

os.makedirs("data/synthetic", exist_ok=True)

df.to_csv(
    "data/synthetic/symptoms.csv",
    index=False
)

print("✅ Symptoms dataset generated!")
print(df.head())