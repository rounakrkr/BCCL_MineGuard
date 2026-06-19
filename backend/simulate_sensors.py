import requests
import random
import time

DEVICES = ["ESP_001", "ESP_002", "ESP_003", "ESP_004", "ESP_005", "ESP_006", "ESP_007", "ESP_008"]
SERVER = "https://bccl-mineguard.onrender.com/api/sensor/data"

print("Starting sensor simulation. Press Ctrl+C to stop.")

try:
    while True:
        for device in DEVICES:
            # Simulate mostly safe, occasionally warning values
            methane = random.uniform(200, 3000)
            co = random.uniform(5, 60)
            temp = random.uniform(24, 36)
            humidity = random.uniform(55, 88)
            
            # Occasionally spike danger for demo purposes on specific devices
            if device == "ESP_004" and random.random() < 0.1:
                methane = random.uniform(5000, 6000)
                co = random.uniform(100, 150)
                
            payload = {
                "device_id": device,
                "methane_ppm": round(methane, 1),
                "co_ppm": round(co, 1),
                "temperature_c": round(temp, 1),
                "humidity_percent": round(humidity, 1)
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
