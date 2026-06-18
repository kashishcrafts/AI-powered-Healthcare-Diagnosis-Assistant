from faker import Faker
import pandas as pd
import random
import os

fake = Faker()

patients = []

for i in range(1000):
    patients.append({
        "patient_id": i + 1,
        "name": fake.name(),
        "age": random.randint(1, 90),
        "gender": random.choice(["Male", "Female"]),
        "height_cm": random.randint(140, 190),
        "weight_kg": random.randint(40, 120),
        "blood_group": random.choice(
            ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        )
    })

df = pd.DataFrame(patients)

os.makedirs("data/synthetic", exist_ok=True)

df.to_csv(
    "data/synthetic/patients.csv",
    index=False
)

print("✅ 1000 patients generated successfully!")
print(df.head())