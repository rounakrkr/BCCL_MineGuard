from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import blueprints
from routes.mine_routes import mine_bp
from routes.sensor_routes import sensor_bp
from routes.alert_routes import alert_bp
from routes.groq_routes import groq_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes, allowing requests from any origin (development mode)
CORS(app)

# Register blueprints
app.register_blueprint(mine_bp)
app.register_blueprint(sensor_bp)
app.register_blueprint(alert_bp)
app.register_blueprint(groq_bp)

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"status": "ok", "message": "MineGuard API is running"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
