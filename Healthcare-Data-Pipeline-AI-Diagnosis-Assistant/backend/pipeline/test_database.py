import sqlite3
import pandas as pd

conn = sqlite3.connect(
    "database/healthcare.db"
)

query = """
SELECT *
FROM diagnosis
LIMIT 10
"""

df = pd.read_sql_query(
    query,
    conn
)

print(df)

conn.close()