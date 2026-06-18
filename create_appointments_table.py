import sqlite3

conn = sqlite3.connect(
    "database/healthcare.db"
)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS appointments (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER,

    doctor_name TEXT,

    appointment_date TEXT,

    appointment_time TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()

conn.close()

print(
    "Appointments Table Created"
)