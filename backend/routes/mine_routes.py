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
        
        # For each mine, fetch the latest reading
        for mine in mines:
            cursor.execute("""
                SELECT methane_ppm, co_ppm, temperature_c, humidity_percent, status, recorded_at 
                FROM sensor_readings 
                WHERE mine_id = %s 
                ORDER BY recorded_at DESC LIMIT 1
            """, (mine['id'],))
            latest = cursor.fetchone()
            mine['latest_reading'] = latest if latest else None
            
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
