import requests
import random
import time

DEVICES = ["ESP_001", "ESP_002", "ESP_003", "ESP_004", "ESP_005", "ESP_006", "ESP_007", "ESP_008"]
SERVER = "https://bccl-mineguard.onrender.com/api/sensor/data"

print("Starting sensor simulation. Press Ctrl+C to stop.")

try:
    while True:
        for device in DEVICES:
            # Generate realistic data hovering tightly around your ambient room values
            # Methane: ~3000, CO: ~240, Temp: ~24, Hum: ~57, Smoke: ~3200
            methane = random.uniform(2950.0, 3150.0)
            co = random.uniform(230.0, 250.0)
            temp = random.uniform(23.5, 24.5)
            humidity = random.uniform(56.0, 59.0)
            smoke = random.uniform(3150.0, 3350.0)
            
            payload = {
                "device_id": "ESP_001",  # Send to ESP_001 so it mirrors to all mines
                "methane_ppm": round(methane, 1),
                "co_ppm": round(co, 1),
                "temperature_c": round(temp, 1),
                "humidity_percent": round(humidity, 1),
                "smoke_ppm": round(smoke, 1),
                "fire_detected": False,
                "is_simulated": True
            }
            
            try:
                response = requests.post(SERVER, json=payload, timeout=20)
                if response.status_code == 200:
                    status = response.json().get('safety_status', 'UNKNOWN')
                    print(f"Sent data for {device} - Status: {status}")
                else:
                    print(f"Error for {device}: Status code {response.status_code}")
            except Exception as e:
                print(f"Failed to connect to server: {e}")
                
            # Add a small 1.5 second delay between each sensor to prevent overwhelming the free Render server CPU
            time.sleep(1.5)
                
            time.sleep(1) # delay between devices to spread requests
            
        print("Waiting 5 seconds before next round...\n")
        time.sleep(5)  # Wait before next round

except KeyboardInterrupt:
    print("Simulation stopped by user.")
