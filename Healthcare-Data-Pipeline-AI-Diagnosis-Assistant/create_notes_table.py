import sqlite3

conn = sqlite3.connect("database/healthcare.db")

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS doctor_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("Doctor Notes Table Created")