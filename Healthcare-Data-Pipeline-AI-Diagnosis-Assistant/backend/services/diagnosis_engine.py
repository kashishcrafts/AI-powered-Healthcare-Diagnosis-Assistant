def diagnose_patient(patient):

    diseases = []

    # Diabetes
    if patient["blood_sugar"] > 180:
        diseases.append(
            {
                "disease": "Diabetes",
                "confidence": 85
            }
        )

    # Hypertension
    if patient["systolic_bp"] > 140:
        diseases.append(
            {
                "disease": "Hypertension",
                "confidence": 80
            }
        )

    # Anemia
    if patient["hemoglobin"] < 10:
        diseases.append(
            {
                "disease": "Anemia",
                "confidence": 75
            }
        )

    # Kidney Disease
    if patient["creatinine"] > 2:
        diseases.append(
            {
                "disease": "Kidney Disease",
                "confidence": 82
            }
        )

    if len(diseases) == 0:
        diseases.append(
            {
                "disease": "Healthy",
                "confidence": 90
            }
        )

    return diseases