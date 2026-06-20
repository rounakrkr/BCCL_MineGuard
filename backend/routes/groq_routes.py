from flask import Blueprint, jsonify, request
import os
from groq import Groq

groq_bp = Blueprint('groq_bp', __name__)

# Initialize Groq client
client = None
try:
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if groq_api_key:
        client = Groq(api_key=groq_api_key, timeout=8.0)
except Exception as e:
    print(f"Error initializing Groq: {e}")

@groq_bp.route('/api/groq/insight', methods=['POST'])
def get_insight():
    if not client:
        return jsonify({"error": "Groq API key not configured properly"}), 500
        
    try:
        mine_data = request.json
        
        prompt = f"""
        You are a coal mine safety expert AI assistant for BCCL (Bharat Coking Coal Limited), India.
        
        Analyze the following real-time sensor data from {mine_data.get('mine_name')} located at {mine_data.get('location')}:
        
        - Methane (CH4): {mine_data.get('methane_ppm')} PPM
        - Carbon Monoxide (CO): {mine_data.get('co_ppm')} PPM
        - Temperature: {mine_data.get('temperature_c')}°C
        - Humidity: {mine_data.get('humidity_percent')}%
        - Overall Status: {mine_data.get('status')}
        - Active Workers Underground: {mine_data.get('active_workers')}
        
        Provide a simple safety insight in 3-4 sentences. Include:
        1. Overall safety assessment
        2. Simple actionable recommendation
        
        CRITICAL CONTEXT ABOUT SENSORS: 
        The sensors in this deployment are uncalibrated and have high resting ambient readings. 
        You MUST evaluate safety strictly based on these thresholds:
        - Methane: SAFE is below 3500 PPM.
        - Carbon Monoxide: SAFE is below 300 PPM.
        - Smoke: SAFE is below 3800 PPM.
        If the current readings are below these thresholds, explicitly state that gas levels are normal and safe, and do not raise any concern about them being high.
        
        CRITICAL INSTRUCTION: Write in very simple, plain English that an older government officer in India can easily understand. Avoid heavy technical jargon. Keep the tone respectful and direct. The length should be around 60-80 words. Do not use bullet points.
        """
        
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            max_tokens=150,
            temperature=0.4
        )
        
        insight = chat_completion.choices[0].message.content
        return jsonify({"insight": insight})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
