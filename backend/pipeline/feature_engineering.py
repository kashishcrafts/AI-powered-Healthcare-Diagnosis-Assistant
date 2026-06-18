import pandas as pd

df = pd.read_csv(
    "data/processed/master_patient_dataset.csv"
)

# BMI Calculation
df["height_m"] = df["height_cm"] / 100

df["BMI"] = (
    df["weight_kg"] /
    (df["height_m"] ** 2)
).round(2)

# BMI Category
def bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"

df["BMI_Category"] = df["BMI"].apply(
    bmi_category
)

# Blood Sugar Category
def sugar_category(value):
    if value < 100:
        return "Normal"
    elif value < 126:
        return "Prediabetes"
    else:
        return "Diabetes Risk"

df["BloodSugar_Category"] = (
    df["blood_sugar"]
    .apply(sugar_category)
)

# Blood Pressure Category
def bp_category(value):
    if value < 120:
        return "Normal"
    elif value < 140:
        return "Elevated"
    else:
        return "High Risk"
        
df["BP_Category"] = (
    df["systolic_bp"]
    .apply(bp_category)
)

df.to_csv(
    "data/processed/master_patient_dataset.csv",
    index=False
)

print("✅ Feature Engineering Completed")
print(df.head())