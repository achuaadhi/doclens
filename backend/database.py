import sqlite3

def get_db():
    conn = sqlite3.connect("doclens.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS certificates (
            id TEXT PRIMARY KEY,
            owner_name TEXT NOT NULL,
            issue_date TEXT NOT NULL
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS uploaded_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cert_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            ocr_data TEXT,
            risk_score INTEGER,
            risk_level TEXT,
            ela_path TEXT,
            upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cert_id) REFERENCES certificates (id)
        )
    ''')
    conn.commit()

init_db()
