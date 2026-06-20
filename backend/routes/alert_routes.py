from flask import Blueprint, jsonify
from models.db import get_db_connection

alert_bp = Blueprint('alert_bp', __name__)

@alert_bp.route('/api/alerts/<int:mine_id>', methods=['GET'])
def get_mine_alerts(mine_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get last 10 alerts for this mine
        cursor.execute("""
            SELECT * FROM alerts 
            WHERE mine_id = %s 
            ORDER BY triggered_at DESC LIMIT 10
        """, (mine_id,))
        alerts = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify({"alerts": alerts})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@alert_bp.route('/api/alerts/<int:mine_id>', methods=['DELETE'])
def clear_mine_alerts(mine_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Delete all alerts for this mine
        cursor.execute("DELETE FROM alerts WHERE mine_id = %s", (mine_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"message": "Alerts cleared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
