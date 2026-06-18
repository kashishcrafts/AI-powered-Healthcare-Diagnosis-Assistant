import sqlite3

conn = sqlite3.connect(
    "database/healthcare.db"
)

cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS timeline (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER,

    event_type TEXT,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print(
    "Timeline Table Created"
)