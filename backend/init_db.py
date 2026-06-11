import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

try:
    # Connect to MySQL server
    db = pymysql.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD", "12345"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        database="test",
        ssl={"ssl":{}},
        autocommit=True
    )
    cursor = db.cursor()

    # Read the schema file
    schema_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'schema.sql')
    with open(schema_path, 'r') as f:
        sql_commands = f.read()

    # Execute all statements in the schema file (split by ;)
    statements = sql_commands.split(';')
    for statement in statements:
        if statement.strip():
            cursor.execute(statement)

    cursor.close()
    db.close()
    print("Success: Database 'mineguard_db' created and dummy data inserted!")
except Exception as e:
    print("Error:", e)
