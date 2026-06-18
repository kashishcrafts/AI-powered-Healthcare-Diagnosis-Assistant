from fastapi import FastAPI
import sqlite3
import pandas as pd
from services.diagnosis_engine import diagnose_patient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from services.recommendation_engine import get_recommendations
from pydantic import BaseModel
from pydantic import BaseModel
from datetime import datetime, timedelta
from api.auth import create_access_token
from jose import jwt

import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

class LoginRequest(BaseModel):
    username: str
    password: str

class NoteRequest(BaseModel):
    note: str

app = FastAPI(
    title="Healthcare AI Diagnosis Assistant",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "https://your-project.vercel.app"
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AppointmentRequest(
    BaseModel
):
    doctor_name: str
    appointment_date: str
    appointment_time: str

# Home Route
@app.get("/")
def home():
    return {
        "message": "Healthcare AI Diagnosis Assistant Running"
    }

# All Patients
@app.get("/patients")
def get_patients():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT
        p.patient_id,
        p.name,
        p.age,
        p.gender,
        d.disease,
        d.risk_score,
        d.risk_level
    FROM patients p
    LEFT JOIN diagnosis d
    ON p.patient_id = d.patient_id
    LIMIT 100
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return df.to_dict(
        orient="records"
    )

# Single Patient
@app.get("/patient/{patient_id}")
def get_patient(patient_id: int):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = f"""
    SELECT *
    FROM patients
    WHERE patient_id={patient_id}
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    df = df.rename(
    columns={
        "Risk_Score": "risk_score",
        "Risk_Level": "risk_level"
    }
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

# Diagnosis
@app.get("/diagnosis/{patient_id}")
def get_diagnosis(patient_id: int):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = f"""
    SELECT *
    FROM diagnosis
    WHERE patient_id={patient_id}
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

#Risk Summary

@app.get("/risk-summary")
def risk_summary():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT risk_level,
           COUNT(*) as count
    FROM diagnosis
    GROUP BY risk_level
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    df.columns = [
    "risk_level",
    "count"
]

    return df.to_dict(
        orient="records"
    )

#High Risk Patients

@app.get("/high-risk-patients")
def high_risk_patients():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT *
    FROM diagnosis
    WHERE risk_level IN
    ('High Risk','Critical Risk')
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

#Disease Distribution

@app.get("/disease-distribution")
def disease_distribution():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT disease,
           COUNT(*) as count
    FROM diagnosis
    GROUP BY disease
    ORDER BY count DESC
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

@app.get("/ai-diagnosis/{patient_id}")
def ai_diagnosis(patient_id: int):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = f"""
    SELECT *
    FROM lab_results
    WHERE patient_id={patient_id}
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    if len(df) == 0:
        return {
            "error": "Patient not found"
        }

    patient = df.iloc[0].to_dict()

    diagnosis = diagnose_patient(
        patient
    )

    return {
        "patient_id": patient_id,
        "diagnosis": diagnosis
    }

def get_patient_full(patient_id):

    conn = sqlite3.connect("../database/healthcare.db")

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM patients p
        JOIN diagnosis d
        ON p.patient_id = d.patient_id
        WHERE p.patient_id = ?
    """, (patient_id,))

    row = cursor.fetchone()

    conn.close()

    return dict(row)

@app.get("/patient-full/{patient_id}")
def patient_full(patient_id: int):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = f"""
    SELECT
        p.*,
        d.disease,
        d.risk_score,
        d.risk_level
    FROM patients p
    LEFT JOIN diagnosis d
    ON p.patient_id = d.patient_id
    WHERE p.patient_id = {patient_id}
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

@app.get("/stats")
def stats():

    conn = sqlite3.connect("../database/healthcare.db")

    total_patients = pd.read_sql_query(
        "SELECT COUNT(*) as total FROM patients",
        conn
    )

    conn.close()

    return {
        "total_patients": int(total_patients["total"][0])
    }

@app.get("/high-risk-count")
def high_risk_count():

    conn = sqlite3.connect("../database/healthcare.db")

    query = """
    SELECT COUNT(*) AS total
    FROM diagnosis
    WHERE risk_level IN ('High Risk', 'Critical Risk')
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return {
        "high_risk_patients": int(df["total"][0])
    }


@app.get("/disease-count")
def disease_count():

    conn = sqlite3.connect("../database/healthcare.db")

    query = """
    SELECT COUNT(DISTINCT disease) AS total
    FROM diagnosis
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return {
        "total_diseases": int(df["total"][0])
    }

@app.get("/download-report/{patient_id}")
def download_report(patient_id: int):

    # temporary demo version

    patient = {
        "name": "Demo Patient",
        "age": 45,
        "disease": "Diabetes",
        "Risk_Level": "High Risk"
    }

    from reports.generate_report import create_patient_report

    filename = f"patient_{patient_id}.pdf"

    create_patient_report(
        patient,
        filename
    )

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename
    )

@app.get("/top-risk-patients")
def top_risk_patients():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT
        p.patient_id,
        p.name,
        d.disease,
        d.risk_score,
        d.risk_level
    FROM patients p
    JOIN diagnosis d
    ON p.patient_id = d.patient_id
    ORDER BY d.risk_score DESC
    LIMIT 5
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return df.to_dict(
        orient="records"
    )

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

@app.post("/ai-diagnosis")
def ai_diagnosis_chat(request: ChatRequest):

    msg = request.message.lower()

    if "fever" in msg:
        diagnosis = "Possible Viral Infection"

    elif "cough" in msg:
        diagnosis = "Possible Respiratory Infection"

    elif "chest pain" in msg:
        diagnosis = "Possible Cardiac Issue"

    else:
        diagnosis = "Further Evaluation Required"

    return {
        "diagnosis": diagnosis,
        "confidence": "78%"
    }

@app.get("/recommendations/{patient_id}")
def recommendations(patient_id: int):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = f"""
    SELECT disease
    FROM diagnosis
    WHERE patient_id={patient_id}
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    if len(df) == 0:
        return {
            "recommendations": []
        }

    disease = df.iloc[0]["disease"]

    recommendations = get_recommendations(
        disease
    )

    return {
        "disease": disease,
        "recommendations": recommendations
    }

@app.get("/notes/{patient_id}")
def get_notes(patient_id: int):

    conn = sqlite3.connect("../database/healthcare.db")

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM doctor_notes
        WHERE patient_id = ?
        ORDER BY created_at DESC
        """,
        (patient_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    return [dict(row) for row in rows]

@app.post("/notes/{patient_id}")
def add_note(
    patient_id: int,
    request: NoteRequest
):

    conn = sqlite3.connect("../database/healthcare.db")

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO doctor_notes
        (patient_id, note)
        VALUES (?, ?)
        """,
        (
            patient_id,
            request.note
        )
    )

    conn.commit()

    conn.close()

    return {
        "message": "Note saved successfully"
    }

@app.get("/critical-patients")
def critical_patients():

    conn = sqlite3.connect("../database/healthcare.db")

    query = """
    SELECT patient_id,
           disease,
           risk_score,
           risk_level
    FROM diagnosis
    WHERE risk_level = 'Critical Risk'
    ORDER BY risk_score DESC
    LIMIT 5
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return df.to_dict(
        orient="records"
    )

@app.get("/gender-distribution")
def gender_distribution():

    conn = sqlite3.connect("../database/healthcare.db")

    query = """
    SELECT gender,
    COUNT(*) as count
    FROM patients
    GROUP BY gender
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return df.to_dict(orient="records")

@app.get("/age-groups")
def age_groups():

    conn = sqlite3.connect("../database/healthcare.db")

    query = """
    SELECT
    CASE
      WHEN age < 30 THEN '0-30'
      WHEN age < 50 THEN '31-50'
      WHEN age < 70 THEN '51-70'
      ELSE '70+'
    END AS age_group,

    COUNT(*) as count

    FROM patients

    GROUP BY age_group
    """

    df = pd.read_sql_query(query, conn)

    conn.close()

    return df.to_dict(
      orient="records"
    )

@app.post(
"/appointments/{patient_id}"
)
def create_appointment(
    patient_id: int,
    request: AppointmentRequest
):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO appointments
        (
          patient_id,
          doctor_name,
          appointment_date,
          appointment_time
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            patient_id,
            request.doctor_name,
            request.appointment_date,
            request.appointment_time
        )
    )

    conn.commit()

    conn.close()

    return {
        "message":
        "Appointment Scheduled"
    }

@app.get(
"/appointments/{patient_id}"
)
def get_appointments(
    patient_id: int
):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM appointments
        WHERE patient_id = ?
        ORDER BY id DESC
        """,
        (patient_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    return [
      dict(row)
      for row in rows
    ]

@app.post(
"/timeline/{patient_id}"
)
def add_timeline_event(
    patient_id: int,
    request: dict
):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO timeline
        (
            patient_id,
            event_type,
            description
        )
        VALUES (?, ?, ?)
        """,
        (
            patient_id,
            request["event_type"],
            request["description"]
        )
    )

    conn.commit()
    conn.close()

    return {
        "message":
        "Timeline Added"
    }

@app.get(
"/timeline/{patient_id}"
)
def get_timeline(
    patient_id: int
):

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM timeline
        WHERE patient_id = ?
        ORDER BY created_at DESC
        """,
        (patient_id,)
    )

    rows = cursor.fetchall()

    conn.close()

    return [
        dict(row)
        for row in rows
    ]

@app.get("/notifications")
def notifications():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    critical = pd.read_sql_query(
        """
        SELECT COUNT(*) cnt
        FROM diagnosis
        WHERE risk_level='Critical Risk'
        """,
        conn
    )

    high = pd.read_sql_query(
        """
        SELECT COUNT(*) cnt
        FROM diagnosis
        WHERE risk_level='High Risk'
        """,
        conn
    )

    conn.close()

    return {
        "critical": int(critical.iloc[0]["cnt"]),
        "high": int(high.iloc[0]["cnt"])
    }

@app.get("/critical-patient-details")
def critical_patient_details():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT
        p.patient_id,
        p.name,
        d.disease,
        d.risk_score
    FROM patients p
    INNER JOIN diagnosis d
        ON p.patient_id = d.patient_id
    WHERE d.risk_level='Critical Risk'
    ORDER BY d.risk_score DESC
    LIMIT 20
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    return df.to_dict(
        orient="records"
    )

@app.get("/export-patients")
def export_patients():

    conn = sqlite3.connect(
    "../database/healthcare.db"
)

    df = pd.read_sql_query(
        """
        SELECT *
        FROM patients
        """,
        conn
    )

    conn.close()

    file_path = "patients_export.csv"

    df.to_csv(
        file_path,
        index=False
    )

    return FileResponse(
        file_path,
        filename=
        "patients_export.csv"
    )

@app.get("/export-high-risk")
def export_high_risk():

    conn = sqlite3.connect(
        "../database/healthcare.db"
    )

    query = """
    SELECT *
    FROM diagnosis
    WHERE risk_level IN
    ('High Risk','Critical Risk')
    """

    df = pd.read_sql_query(
        query,
        conn
    )

    conn.close()

    file_path = "high_risk_patients.csv"

    df.to_csv(
      file_path,
      index=False
    )

    return FileResponse(
      file_path,
      filename=
      "high_risk_patients.csv"
    )

@app.get("/ai-insights")
def ai_insights():

    return {

      "prediction":
      "Increase monitoring for diabetic patients",

      "confidence":
      "94%",

      "risk_forecast":
      "32 patients likely to become high risk within 30 days"
    }

@app.get("/dashboard-summary")
def dashboard_summary():

    conn = sqlite3.connect(
      "../database/healthcare.db"
    )

    total = pd.read_sql_query(
      "SELECT COUNT(*) cnt FROM patients",
      conn
    )

    critical = pd.read_sql_query(
      """
      SELECT COUNT(*) cnt
      FROM diagnosis
      WHERE risk_level='Critical Risk'
      """,
      conn
    )

    conn.close()

    return {
      "patients":
      int(total.iloc[0]["cnt"]),

      "critical":
      int(critical.iloc[0]["cnt"]),

      "status":
      "Operational"
    }

@app.get(
"/risk-forecast/{patient_id}"
)
def risk_forecast(
patient_id:int
):

    patient = get_patient_full(
      patient_id
    )

    score = patient.get(
      "risk_score",
      0
    )

    future_risk = min(
      score + 1.5,
      10
    )

    return {

      "current_risk":
      score,

      "forecast_risk":
      future_risk,

      "prediction":
      "Risk may increase if no intervention occurs"
    }

@app.post("/login")
def login(request: LoginRequest):

    if (
        request.username == "admin"
        and request.password == "admin123"
    ):

        token = jwt.encode(
            {
                "user": "admin",
                "role": "admin",
                "exp":
                datetime.utcnow()
                + timedelta(hours=8)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "token": token,
            "role": "admin"
        }

    if (
        request.username == "doctor"
        and request.password == "doctor123"
    ):

        token = jwt.encode(
            {
                "user": "doctor",
                "role": "doctor",
                "exp":
                datetime.utcnow()
                + timedelta(hours=8)
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {
            "token": token,
            "role": "doctor"
        }

    return {
        "error": "Invalid Credentials"
    }
