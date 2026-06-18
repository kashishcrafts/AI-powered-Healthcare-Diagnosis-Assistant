def get_recommendations(disease):

    disease = str(disease).lower()

    if "diabetes" in disease:
        return [
            "Monitor blood sugar regularly",
            "Reduce sugar intake",
            "Exercise daily",
            "HbA1c test every 3 months"
        ]

    elif "hypertension" in disease:
        return [
            "Reduce salt intake",
            "Monitor blood pressure",
            "Avoid stress",
            "Cardiology consultation"
        ]

    elif "heart" in disease:
        return [
            "ECG evaluation",
            "Low cholesterol diet",
            "Cardiology follow-up",
            "Daily walking"
        ]

    elif "kidney" in disease:
        return [
            "Monitor creatinine levels",
            "Increase hydration",
            "Nephrology consultation",
            "Avoid excess sodium"
        ]

    else:
        return [
            "Regular health monitoring",
            "Maintain healthy lifestyle",
            "Follow doctor recommendations"
        ]