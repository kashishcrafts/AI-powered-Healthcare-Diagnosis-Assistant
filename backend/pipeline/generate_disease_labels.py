import pandas as pd

labs = pd.read_csv("data/synthetic/lab_results.csv")

diseases = []

for _, row in labs.iterrows():

    disease = "Healthy"

    if row["blood_sugar"] > 180:
        disease = "Diabetes"

    elif row["systolic_bp"] > 140:
        disease = "Hypertension"

    elif row["hemoglobin"] < 10:
        disease = "Anemia"

    elif row["creatinine"] > 2:
        disease = "Kidney Disease"

    diseases.append({
        "patient_id": row["patient_id"],
        "disease": disease
    })

df = pd.DataFrame(diseases)

df.to_csv(
    "data/synthetic/disease_labels.csv",
    index=False
)

print("✅ Disease Labels Generated!")
print(df["disease"].value_counts())