import os
import psycopg2
from psycopg2 import Error as PgError
from fastapi import HTTPException

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "database")

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME
        )
        return conn
    except PgError as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {e}")

def create_table():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                board JSONB NOT NULL,
                human_player VARCHAR(1) NOT NULL,
                ai_player VARCHAR(1) NOT NULL,
                current_player VARCHAR(1) NOT NULL,
                difficulty VARCHAR(10) NOT NULL,
                game_active BOOLEAN NOT NULL,
                winner VARCHAR(1)
            );
        """)
        conn.commit()
    except PgError as e:
        print(f"Error creating table: {e}")
        # In a real application, you might want to log this error more robustly
    finally:
        if conn:
            conn.close()


