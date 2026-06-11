import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Get a fresh connection for each request to avoid serverless timeouts"""
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "12345"),
        database=os.getenv("MYSQL_DB", "mineguard_db"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        ssl_verify_identity=True
    )
