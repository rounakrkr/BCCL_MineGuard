import pymysql

# Connection details
host = "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com"
port = 4000
user = "2sL5E8Gr7SwgzAZ.root"
password = "TjpCt9uPyv6EGHNk"
db_name = "mineguard_db"

print(f"Connecting to TiDB Cluster...")
try:
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=db_name,
        ssl={"ssl_verify_cert": False}
    )
    cursor = conn.cursor()
    
    print("Checking if columns exist or need to be added...")
    
    # Try adding smoke_ppm
    try:
        cursor.execute("ALTER TABLE sensor_readings ADD COLUMN smoke_ppm DECIMAL(8,2) AFTER co_ppm;")
        print("✅ Added 'smoke_ppm' column to sensor_readings")
    except Exception as e:
        print(f"Column smoke_ppm might already exist or error: {e}")
        
    # Try adding fire_detected
    try:
        cursor.execute("ALTER TABLE sensor_readings ADD COLUMN fire_detected BOOLEAN DEFAULT FALSE AFTER smoke_ppm;")
        print("✅ Added 'fire_detected' column to sensor_readings")
    except Exception as e:
        print(f"Column fire_detected might already exist or error: {e}")

    conn.commit()
    print("\n🎉 Database Upgrade Complete! Ready for new sensors.")
    
except Exception as e:
    print(f"\n❌ Error connecting: {e}")
finally:
    if 'conn' in locals() and conn.open:
        conn.close()
