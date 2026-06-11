import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()
db = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", "12345"),
    database="mineguard_db",
    port=int(os.getenv("MYSQL_PORT", 3306))
)
cursor = db.cursor()
cursor.execute("UPDATE mines SET mine_name='Bastacolla Colliery' WHERE device_id='ESP_005'")
db.commit()
cursor.close()
db.close()
print("done")
