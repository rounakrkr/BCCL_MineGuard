import pymysql
import pymysql.cursors
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Get a fresh connection for each request to avoid serverless timeouts"""
    return pymysql.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "12345"),
        database=os.getenv("MYSQL_DB", "mineguard_db"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        ssl={"ssl":{}},
        cursorclass=pymysql.cursors.DictCursor,
        connect_timeout=10
    )
