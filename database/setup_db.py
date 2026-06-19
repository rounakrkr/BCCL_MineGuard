import os
import pymysql
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

host = os.getenv('DB_HOST')
port = int(os.getenv('DB_PORT'))
user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
# Connect without database first to create it
db_name = os.getenv('DB_NAME')

try:
    print(f"Connecting to TiDB Cluster at {host}...")
    # TiDB requires SSL
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        ssl={"ssl_verify_cert": False}
    )
    cursor = conn.cursor()
    
    print("Reading schema.sql...")
    with open('schema.sql', 'r') as f:
        sql_commands = f.read().split(';')
    
    for cmd in sql_commands:
        if cmd.strip():
            print(f"Executing: {cmd.strip()[:50]}...")
            cursor.execute(cmd)
            
    conn.commit()
    print("\n✅ Success! All tables created and dummy data inserted into TiDB!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
finally:
    if 'conn' in locals() and conn.open:
        conn.close()
