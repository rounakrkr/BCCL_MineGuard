from flask import Blueprint, jsonify, request
from models.db import get_db_connection

mine_bp = Blueprint('mine_bp', __name__)

@mine_bp.route('/api/mines', methods=['GET'])
def get_all_mines():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all mines
        cursor.execute("SELECT * FROM mines ORDER BY location ASC, mine_name ASC")
        mines = cursor.fetchall()
        
        # Fetch all latest readings in one query using MAX(id)
        cursor.execute("""
            SELECT sr.mine_id, sr.methane_ppm, sr.co_ppm, sr.temperature_c, sr.humidity_percent, sr.smoke_ppm, sr.fire_detected, sr.status, sr.recorded_at 
            FROM sensor_readings sr
            INNER JOIN (
                SELECT mine_id, MAX(id) as max_id 
                FROM sensor_readings 
                GROUP BY mine_id
            ) latest ON sr.id = latest.max_id
        """)
        latest_readings = {row['mine_id']: row for row in cursor.fetchall()}
        
        for mine in mines:
            mine['latest_reading'] = latest_readings.get(mine['id'])
            
        cursor.close()
        conn.close()
        return jsonify({"mines": mines})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mine_bp.route('/api/mines/<int:mine_id>', methods=['GET'])
def get_mine_details(mine_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get mine details
        cursor.execute("SELECT * FROM mines WHERE id = %s", (mine_id,))
        mine = cursor.fetchone()
        
        if not mine:
            return jsonify({"error": "Mine not found"}), 404
            
        # Get last 50 readings
        cursor.execute("""
            SELECT * FROM sensor_readings 
            WHERE mine_id = %s 
            ORDER BY recorded_at DESC LIMIT 50
        """, (mine_id,))
        readings = cursor.fetchall()
        # reverse readings to be chronological for charts
        readings.reverse()
        
        mine['readings'] = readings
        
        cursor.close()
        conn.close()
        return jsonify(mine)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
