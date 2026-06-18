from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def create_patient_report(patient, filename):

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph("Healthcare Diagnosis Report", styles["Title"])
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(f"Patient: {patient['name']}", styles["Normal"])
    )

    content.append(
        Paragraph(f"Age: {patient['age']}", styles["Normal"])
    )

    content.append(
        Paragraph(f"Disease: {patient['disease']}", styles["Normal"])
    )

    content.append(
        Paragraph(f"Risk Level: {patient['Risk_Level']}", styles["Normal"])
    )

    doc.build(content)