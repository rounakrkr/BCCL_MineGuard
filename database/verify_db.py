import pymysql

host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com"
port = 4000
user = "2sL5E8Gr7SwgzAZ.root"
password = "TjpCt9uPyv6EGHNk"
db_name = "mineguard_db"

try:
    conn = pymysql.connect(host=host, port=port, user=user, password=password, database=db_name, ssl={"ssl_verify_cert": False})
    cursor = conn.cursor()
    cursor.execute("DESCRIBE sensor_readings;")
    rows = cursor.fetchall()
    columns = [row[0] for row in rows]
    print("Columns in sensor_readings:", columns)
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.open:
        conn.close()
