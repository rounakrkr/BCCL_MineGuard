import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

# Create a connection pool for the database
db_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name="mineguard_pool",
    pool_size=5,
    host=os.getenv("MYSQL_HOST", "localhost"),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", "12345"),
    database=os.getenv("MYSQL_DB", "mineguard_db"),
    port=int(os.getenv("MYSQL_PORT", 3306)),
    ssl_verify_identity=True
)

def get_db_connection():
    """Get a connection from the pool"""
    return db_pool.get_connection()
