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
        smoke = data.get('smoke_ppm', 0)
        fire = data.get('fire_detected', False)
        
        if not device_id:
            return jsonify({"error": "device_id is required"}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch all mines to mirror the data across the dashboard
        cursor.execute("SELECT id FROM mines")
        mines = cursor.fetchall()
        
        if not mines:
            cursor.close()
            conn.close()
            return jsonify({"error": "No mines found in database"}), 404
            
        # Calculate status once
        status = get_overall_status(methane, co, temp, humidity, smoke, fire)
        alert_triggered = False
        
        # Insert the reading and alerts for EVERY mine
        for mine in mines:
            mine_id = mine['id']
            
            cursor.execute("""
                INSERT INTO sensor_readings 
                (mine_id, device_id, methane_ppm, co_ppm, smoke_ppm, fire_detected, temperature_c, humidity_percent, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (mine_id, device_id, methane, co, smoke, fire, temp, humidity, status))
            
            # Check for alerts
            if status in ['WARNING', 'DANGER']:
                alert_triggered = True
                
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
                    
                if smoke >= THRESHOLDS['smoke_ppm']['warning']:
                    cursor.execute("""
                        INSERT INTO alerts (mine_id, alert_type, sensor_value, threshold_value, severity)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (mine_id, 'HIGH_SMOKE', smoke, THRESHOLDS['smoke_ppm']['warning'], status))
                    
                if fire:
                    cursor.execute("""
                        INSERT INTO alerts (mine_id, alert_type, sensor_value, threshold_value, severity)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (mine_id, 'FIRE_DETECTED', 1, 1, 'DANGER'))
                
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
