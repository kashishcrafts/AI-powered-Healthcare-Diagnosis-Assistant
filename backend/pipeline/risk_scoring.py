import pandas as pd

df = pd.read_csv(
    "data/processed/master_patient_dataset.csv"
)

risk_scores = []
risk_levels = []

for _, row in df.iterrows():

    score = 0

    # Blood Sugar
    if row["blood_sugar"] > 200:
        score += 3
    elif row["blood_sugar"] > 126:
        score += 2

    # Blood Pressure
    if row["systolic_bp"] > 160:
        score += 3
    elif row["systolic_bp"] > 140:
        score += 2

    # Hemoglobin
    if row["hemoglobin"] < 10:
        score += 2

    # Creatinine
    if row["creatinine"] > 2:
        score += 3

    # BMI
    if row["BMI"] > 30:
        score += 2

    risk_scores.append(score)

    if score <= 2:
        risk_levels.append("Low Risk")

    elif score <= 5:
        risk_levels.append("Medium Risk")

    elif score <= 8:
        risk_levels.append("High Risk")

    else:
        risk_levels.append("Critical Risk")

df["Risk_Score"] = risk_scores
df["Risk_Level"] = risk_levels

df.to_csv(
    "data/processed/master_patient_dataset.csv",
    index=False
)

print("✅ Risk Scoring Completed")
print()

print(
    df["Risk_Level"]
    .value_counts()
)