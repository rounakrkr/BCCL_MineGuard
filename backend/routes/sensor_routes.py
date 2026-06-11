from flask import Blueprint, jsonify, request
from models.db import get_db_connection
from utils.thresholds import get_overall_status, THRESHOLDS

sensor_bp = Blueprint('sensor_bp', __name__)

@sensor_bp.route('/api/sensor/data', methods=['POST'])
def receive_sensor_data():
    try:
        data = request.json
        device_id = data.get('device_id')
        methane = data.get('methane_ppm')
        co = data.get('co_ppm')
        temp = data.get('temperature_c')
        humidity = data.get('humidity_percent')
        
        if not device_id:
            return jsonify({"error": "device_id is required"}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Look up mine by device_id
        cursor.execute("SELECT id FROM mines WHERE device_id = %s", (device_id,))
        mine = cursor.fetchone()
        
        if not mine:
            cursor.close()
            conn.close()
            return jsonify({"error": "Unknown device_id"}), 404
            
        mine_id = mine['id']
        
        # Calculate status
        status = get_overall_status(methane, co, temp, humidity)
        
        # Insert reading
        cursor.execute("""
            INSERT INTO sensor_readings 
            (mine_id, device_id, methane_ppm, co_ppm, temperature_c, humidity_percent, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (mine_id, device_id, methane, co, temp, humidity, status))
        
        reading_id = cursor.lastrowid
        
        # Check for alerts
        alert_triggered = False
        if status in ['WARNING', 'DANGER']:
            alert_triggered = True
            
            # Simple logic to log which sensor caused the alert
            if methane >= THRESHOLDS['methane_ppm']['warning']:
                cursor.execute("""
                    INSERT INTO alerts (mine_id, alert_type, sensor_value, threshold_value, severity)
                    VALUES (%s, %s, %s, %s, %s)
                """, (mine_id, 'HIGH_METHANE', methane, THRESHOLDS['methane_ppm']['warning'], status))
                
            if co >= THRESHOLDS['co_ppm']['warning']:
                cursor.execute("""
                    INSERT INTO alerts (mine_id, alert_type, sensor_value, threshold_value, severity)
                    VALUES (%s, %s, %s, %s, %s)
                """, (mine_id, 'HIGH_CO', co, THRESHOLDS['co_ppm']['warning'], status))
                
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            "status": "ok",
            "reading_id": reading_id,
            "safety_status": status,
            "alert_triggered": alert_triggered
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
