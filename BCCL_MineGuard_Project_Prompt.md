# 🏗️ FULL PROJECT PROMPT — BCCL MineGuard Dashboard
### IoT-Based Multi-Mine Real-Time Safety Monitoring System
### (Copy this entire prompt and give it to your AI coding assistant)

---

## 🧠 PROJECT IDENTITY

**Project Name:** MineGuard — BCCL Coal Mine Safety Monitoring System
**Built For:** Bharat Coking Coal Limited (BCCL), Dhanbad, Jharkhand — A subsidiary of Coal India Limited
**Purpose:** A real-time, AI-powered web dashboard that monitors environmental safety data (gas levels, temperature, humidity) from multiple coal mines simultaneously, provides AI-generated insights using Groq API, and alerts employees when dangerous conditions arise.
**Developer Context:** This is being built by a B.Tech CSE intern placed under the AGM at BCCL. The project will be demonstrated to BCCL officials and hosted live on a free server.

---

## 🎯 PROJECT GOALS

1. Show live sensor data from multiple coal mines on a single dashboard
2. Each mine gets its own card on the home screen — clickable to open a detailed mine page
3. On page load, Groq API is called to fetch AI-generated insights for each mine (AQI context, risk summary, weather advisory, safety tip)
4. Hardware: ESP8266 NodeMCU reads MQ-4 (methane), MQ-7 (CO), DHT11 (temp + humidity) and sends data to the backend via HTTP POST over WiFi
5. Backend stores all sensor readings in a MySQL database with timestamps
6. Dashboard is hosted live (Vercel for frontend, Render for backend)
7. The UI should feel professional, modern, and built specifically for BCCL — dark industrial theme, coal/mining aesthetic

---

## 🗂️ COMPLETE FOLDER STRUCTURE

```
mineguard/
│
├── hardware/
│   └── esp8266_sensor_node/
│       └── main.ino                  # Arduino code for ESP8266
│
├── backend/
│   ├── app.py                        # Main Flask application
│   ├── config.py                     # DB config, env vars
│   ├── requirements.txt
│   ├── .env                          # SECRET KEYS (not committed)
│   │
│   ├── routes/
│   │   ├── sensor_routes.py          # POST sensor data, GET readings
│   │   ├── mine_routes.py            # GET mine list, mine details
│   │   └── groq_routes.py            # Groq AI insight endpoint
│   │
│   ├── models/
│   │   ├── db.py                     # MySQL connection pool
│   │   ├── mine.py                   # Mine model
│   │   └── sensor_reading.py         # SensorReading model
│   │
│   └── utils/
│       ├── thresholds.py             # Safety threshold constants
│       └── alert_checker.py          # Logic to check if values are dangerous
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css                 # Global styles + CSS variables
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Multi-mine card grid
│   │   │   └── MinePage.jsx          # Individual mine detail page
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MineCard.jsx          # Individual mine card (home screen)
│   │   │   ├── StatusBadge.jsx       # SAFE / WARNING / DANGER badge
│   │   │   ├── SensorGauge.jsx       # Circular gauge for each sensor value
│   │   │   ├── LiveChart.jsx         # Line chart showing historical readings
│   │   │   ├── AlertBanner.jsx       # Red banner when threshold crossed
│   │   │   ├── AIInsightBox.jsx      # Box showing Groq AI insight text
│   │   │   ├── WeatherWidget.jsx     # Current weather/AQI for mine location
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSensorData.js      # Custom hook: polls backend every 5s
│   │   │   └── useGroqInsight.js     # Custom hook: calls Groq on load
│   │   │
│   │   ├── api/
│   │   │   └── index.js              # Axios instance + all API call functions
│   │   │
│   │   └── utils/
│   │       ├── thresholds.js         # Safety limits (mirror of backend)
│   │       └── formatters.js         # Date, number formatters
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql                    # Full MySQL schema to set up DB
│
└── README.md
```

---

## 🛠️ COMPLETE TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Hardware | ESP8266 NodeMCU + Arduino IDE | WiFi built-in, cheap, widely used |
| Sensors | MQ-4, MQ-7, DHT11 | Methane, CO, Temp/Humidity |
| Backend | Python + Flask | Lightweight REST API |
| Database | MySQL | Relational, easy to query time-series |
| Frontend | React + Vite | Fast, component-based UI |
| Charts | Recharts | React-native charting library |
| AI Insights | Groq API (llama3-8b-8192 model) | Fast, free tier available |
| Styling | Tailwind CSS | Utility-first, rapid UI building |
| Icons | Lucide React | Clean icon set |
| HTTP Client | Axios | API calls from React |
| Frontend Host | Vercel | Free, auto-deploy from GitHub |
| Backend Host | Render | Free tier Flask hosting |
| DB Host | Railway or Clever Cloud | Free MySQL hosting |

---

## 🗃️ DATABASE SCHEMA (MySQL)

```sql
-- schema.sql

CREATE DATABASE IF NOT EXISTS mineguard_db;
USE mineguard_db;

-- Table 1: All registered coal mines
CREATE TABLE mines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mine_name VARCHAR(100) NOT NULL,           -- e.g. "Jharia Mine Block A"
  mine_code VARCHAR(20) UNIQUE NOT NULL,      -- e.g. "JH-A"
  location VARCHAR(100),                      -- e.g. "Jharia, Jharkhand"
  latitude DECIMAL(10, 6),                   -- for weather API
  longitude DECIMAL(10, 6),
  depth_meters INT,                           -- approx underground depth
  active_workers INT DEFAULT 0,
  device_id VARCHAR(50),                      -- ESP8266 device identifier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: All sensor readings (time-series data)
CREATE TABLE sensor_readings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  mine_id INT NOT NULL,
  device_id VARCHAR(50),
  methane_ppm DECIMAL(8,2),                  -- MQ-4 reading in PPM
  co_ppm DECIMAL(8,2),                       -- MQ-7 reading in PPM
  temperature_c DECIMAL(5,2),                -- DHT11 temperature
  humidity_percent DECIMAL(5,2),             -- DHT11 humidity
  status ENUM('SAFE','WARNING','DANGER') DEFAULT 'SAFE',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mine_id) REFERENCES mines(id)
);

-- Table 3: Alert log
CREATE TABLE alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mine_id INT NOT NULL,
  alert_type VARCHAR(50),                    -- e.g. "HIGH_METHANE", "HIGH_CO"
  sensor_value DECIMAL(8,2),
  threshold_value DECIMAL(8,2),
  severity ENUM('WARNING','DANGER'),
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (mine_id) REFERENCES mines(id)
);

-- Seed data: 5 dummy mines
INSERT INTO mines (mine_name, mine_code, location, latitude, longitude, depth_meters, active_workers, device_id)
VALUES
  ('Jharia Block A', 'JH-A', 'Jharia, Jharkhand', 23.7500, 86.4200, 120, 45, 'ESP_001'),
  ('Kusunda Mine', 'KS-1', 'Kusunda, Dhanbad', 23.7891, 86.4532, 95, 38, 'ESP_002'),
  ('Katras Colliery', 'KT-1', 'Katras, Jharkhand', 23.8012, 86.3890, 140, 52, 'ESP_003'),
  ('Sijua Mine', 'SJ-2', 'Sijua, Jharkhand', 23.7234, 86.4780, 110, 29, 'ESP_004'),
  ('Bhaga Colliery', 'BH-1', 'Bhaga, Dhanbad', 23.8134, 86.4321, 88, 41, 'ESP_005');
```

---

## ⚠️ SAFETY THRESHOLDS

```python
# thresholds.py (backend)
THRESHOLDS = {
    "methane_ppm": {
        "safe":    1000,    # Below 1000 PPM = Safe
        "warning": 2500,    # 1000-2500 = Warning (approaching LEL)
        "danger":  5000     # Above 5000 = Danger (explosive range)
    },
    "co_ppm": {
        "safe":    25,      # OSHA permissible limit
        "warning": 50,      # NIOSH recommended limit
        "danger":  100      # Immediately Dangerous to Life (IDLH)
    },
    "temperature_c": {
        "safe":    30,
        "warning": 35,
        "danger":  40
    },
    "humidity_percent": {
        "safe":    80,
        "warning": 90,
        "danger":  95
    }
}

def get_overall_status(methane, co, temp, humidity):
    """Returns 'SAFE', 'WARNING', or 'DANGER' based on all readings"""
    readings = {
        "methane_ppm": methane,
        "co_ppm": co,
        "temperature_c": temp,
        "humidity_percent": humidity
    }
    overall = "SAFE"
    for key, value in readings.items():
        t = THRESHOLDS[key]
        if value >= t["danger"]:
            return "DANGER"
        elif value >= t["warning"]:
            overall = "WARNING"
    return overall
```

---

## 🔌 BACKEND API ENDPOINTS (Flask)

### Base URL: `https://your-backend.onrender.com/api`

```
GET  /api/mines                          → List all mines with latest sensor reading
GET  /api/mines/<mine_id>               → Single mine details + last 50 readings
GET  /api/mines/<mine_id>/readings      → Historical readings (query: ?limit=100&hours=24)
POST /api/sensor/data                   → ESP8266 posts sensor data here
GET  /api/alerts                        → All recent alerts
GET  /api/alerts/<mine_id>             → Alerts for specific mine
GET  /api/dashboard/summary             → Overview stats (total mines, alerts today, etc.)
POST /api/groq/insight                  → Send mine data, get AI insight back
```

### Detailed Endpoint Specs:

```python
# POST /api/sensor/data
# Called by ESP8266 every 10 seconds
# Request Body (JSON):
{
  "device_id": "ESP_001",
  "methane_ppm": 450.2,
  "co_ppm": 18.5,
  "temperature_c": 28.4,
  "humidity_percent": 72.1
}
# Response:
{
  "status": "ok",
  "reading_id": 1043,
  "safety_status": "SAFE",
  "alert_triggered": false
}

# GET /api/mines
# Response:
{
  "mines": [
    {
      "id": 1,
      "mine_name": "Jharia Block A",
      "mine_code": "JH-A",
      "location": "Jharia, Jharkhand",
      "active_workers": 45,
      "depth_meters": 120,
      "latest_reading": {
        "methane_ppm": 450.2,
        "co_ppm": 18.5,
        "temperature_c": 28.4,
        "humidity_percent": 72.1,
        "status": "SAFE",
        "recorded_at": "2025-06-01T14:32:00"
      }
    },
    ...
  ]
}

# POST /api/groq/insight
# Request Body:
{
  "mine_name": "Jharia Block A",
  "location": "Jharia, Jharkhand",
  "methane_ppm": 450.2,
  "co_ppm": 18.5,
  "temperature_c": 28.4,
  "humidity_percent": 72.1,
  "status": "SAFE",
  "active_workers": 45
}
# Response:
{
  "insight": "Current conditions at Jharia Block A are within safe limits.
               Methane levels at 450 PPM are well below the explosive threshold.
               Recommend standard ventilation checks every 2 hours.
               Temperature is optimal for worker comfort..."
}
```

---

## 🤖 GROQ API INTEGRATION

```python
# groq_routes.py

import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_mine_insight(mine_data):
    prompt = f"""
    You are a coal mine safety expert AI assistant for BCCL (Bharat Coking Coal Limited), India.
    
    Analyze the following real-time sensor data from {mine_data['mine_name']} located at {mine_data['location']}:
    
    - Methane (CH4): {mine_data['methane_ppm']} PPM
    - Carbon Monoxide (CO): {mine_data['co_ppm']} PPM
    - Temperature: {mine_data['temperature_c']}°C
    - Humidity: {mine_data['humidity_percent']}%
    - Overall Status: {mine_data['status']}
    - Active Workers Underground: {mine_data['active_workers']}
    
    Provide a concise safety insight in 3-4 sentences. Include:
    1. Overall safety assessment
    2. Any concerning parameters (if any)
    3. One actionable recommendation for mine safety officers
    4. AQI context or weather advisory if relevant for the Jharkhand region
    
    Be professional, factual, and helpful. Do not use bullet points, write in flowing paragraph form.
    """
    
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama3-8b-8192",
        max_tokens=200,
        temperature=0.4
    )
    
    return chat_completion.choices[0].message.content
```

---

## 📟 ESP8266 ARDUINO CODE

```cpp
// hardware/esp8266_sensor_node/main.ino

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ===================== CONFIG =====================
const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL    = "https://your-backend.onrender.com/api/sensor/data";
const char* DEVICE_ID     = "ESP_001";  // Change per device

// ===================== PINS =======================
#define MQ4_PIN   A0    // Methane sensor (analog)
#define MQ7_PIN   A0    // CO sensor (share analog, switch with digital pin)
#define DHT_PIN   D4    // DHT11 data pin
#define BUZZER_PIN D5   // Buzzer
#define LED_GREEN  D6
#define LED_YELLOW D7
#define LED_RED    D8

#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);

// ===================== THRESHOLDS =================
#define METHANE_WARNING  2500
#define METHANE_DANGER   5000
#define CO_WARNING       50
#define CO_DANGER        100

// =================== SETUP =======================
void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

// =================== HELPERS =====================
float readMethane() {
  // MQ-4 raw analog read → convert to PPM (calibrate as needed)
  int raw = analogRead(MQ4_PIN);
  return map(raw, 0, 1023, 0, 10000);  // Simplified mapping
}

float readCO() {
  // MQ-7 analog read → PPM conversion
  int raw = analogRead(MQ7_PIN);
  return map(raw, 0, 1023, 0, 1000);
}

void setStatusLED(String status) {
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);
  
  if (status == "SAFE")    digitalWrite(LED_GREEN, HIGH);
  if (status == "WARNING") digitalWrite(LED_YELLOW, HIGH);
  if (status == "DANGER") {
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER_PIN, 1000);  // Sound buzzer
    delay(500);
    noTone(BUZZER_PIN);
  }
}

void sendDataToServer(float methane, float co, float temp, float hum) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  WiFiClientSecure client;
  client.setInsecure();  // For HTTPS without cert verification
  HTTPClient http;
  
  http.begin(client, SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  // Build JSON payload
  StaticJsonDocument<200> doc;
  doc["device_id"]       = DEVICE_ID;
  doc["methane_ppm"]     = methane;
  doc["co_ppm"]          = co;
  doc["temperature_c"]   = temp;
  doc["humidity_percent"] = hum;
  
  String payload;
  serializeJson(doc, payload);
  
  int responseCode = http.POST(payload);
  
  if (responseCode > 0) {
    String response = http.getString();
    Serial.println("Server response: " + response);
  } else {
    Serial.println("Error sending data: " + String(responseCode));
  }
  
  http.end();
}

// =================== MAIN LOOP ===================
void loop() {
  float methane = readMethane();
  float co      = readCO();
  float temp    = dht.readTemperature();
  float hum     = dht.readHumidity();
  
  // Validate DHT reading
  if (isnan(temp) || isnan(hum)) {
    Serial.println("DHT read failed, retrying...");
    delay(2000);
    return;
  }
  
  // Determine local status
  String status = "SAFE";
  if (methane >= METHANE_DANGER || co >= CO_DANGER) status = "DANGER";
  else if (methane >= METHANE_WARNING || co >= CO_WARNING) status = "WARNING";
  
  // Print to Serial Monitor
  Serial.printf("Methane: %.1f PPM | CO: %.1f PPM | Temp: %.1f°C | Hum: %.1f%% | %s\n",
                methane, co, temp, hum, status.c_str());
  
  // Set LED / Buzzer
  setStatusLED(status);
  
  // Send to backend server
  sendDataToServer(methane, co, temp, hum);
  
  delay(10000);  // Send every 10 seconds
}
```

---

## 🎨 FRONTEND — DETAILED COMPONENT SPECS

### DESIGN THEME:
- **Dark industrial theme** — dark background (#0D1117 or #0F1923), orange/amber accents (#F59E0B), mine/coal aesthetic
- **Font:** Rajdhani or Orbitron for headings (technical feel), Inter for body
- Think: **Mission Control meets Industrial Dashboard**
- Animated glowing status indicators, pulsing dots for live data

---

### 1. Home Page (`Home.jsx`)
```
LAYOUT:
┌─────────────────────────────────────────────────────┐
│  🏗️ MineGuard   BCCL Logo    [🔔 2 Alerts] [Live●] │  ← Navbar
├─────────────────────────────────────────────────────┤
│  BCCL Mine Safety Command Center                    │
│  Real-time monitoring across all active collieries  │
│                                                     │
│  [TOTAL MINES: 5] [SAFE: 3] [WARNING: 1] [DANGER: 1]│  ← Summary bar
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ JH-A     │ │ KS-1     │ │ KT-1     │            │
│  │ Jharia A │ │ Kusunda  │ │ Katras   │  ← MineCards
│  │ ●SAFE    │ │ ⚠WARNING │ │ ●SAFE    │
│  │ CH4:450  │ │ CH4:2800 │ │ CO: 22   │
│  │ CO: 18   │ │ CO: 48   │ │ Tmp:27°C │
│  │ 45 workers│ │ 38 workers│ │ 52 workers│
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  ┌──────────┐ ┌──────────┐                         │
│  │ SJ-2     │ │ BH-1     │                         │
│  │ Sijua    │ │ Bhaga    │                         │
│  │ 🔴DANGER │ │ ●SAFE    │                         │
│  └──────────┘ └──────────┘                         │
└─────────────────────────────────────────────────────┘

BEHAVIOR:
- Cards poll for new data every 10 seconds (useSensorData hook)
- Status badge color changes dynamically: green/yellow/red
- Danger cards have pulsing red border animation
- Clicking any card → navigates to /mine/:mineId
- Groq insight is NOT shown on home page (only on mine detail page)
```

---

### 2. Mine Detail Page (`MinePage.jsx`)
```
LAYOUT:
┌─────────────────────────────────────────────────────────────┐
│ ← Back   🏗️ Jharia Block A (JH-A)    ● LIVE    ⚠ WARNING  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────────────────────┐  ┌─────────────────────────┐  │
│ │  🤖 AI SAFETY INSIGHT    │  │  MINE INFO              │  │
│ │  (Groq generated text    │  │  Location: Jharia, JH   │  │
│ │   loads on page open)    │  │  Depth: 120m            │  │
│ │                          │  │  Workers: 45            │  │
│ │  Loading spinner while   │  │  Device: ESP_001        │  │
│ │  Groq API responds...    │  │  Last Update: 14:32:05  │  │
│ └──────────────────────────┘  └─────────────────────────┘  │
│                                                             │
│ LIVE SENSOR READINGS:                                       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ 🔥 CH4   │ │ ☁️ CO    │ │ 🌡️ TEMP  │ │ 💧 HUM   │       │
│ │ 2847 PPM │ │ 48 PPM   │ │ 29.4°C   │ │ 74.2%    │       │
│ │ ⚠WARNING │ │ ⚠WARNING │ │ ● SAFE   │ │ ● SAFE   │       │
│ │  [gauge] │ │  [gauge] │ │  [gauge] │ │  [gauge] │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│ HISTORICAL TRENDS (Last 2 Hours):                           │
│ ┌─────────────────────────────────────────────────────┐    │
│ │  [Line Chart - Recharts]                            │    │
│ │  All 4 parameters on same chart with toggle         │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                             │
│ RECENT ALERTS:                                              │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ ⚠ 14:28 — Methane rose to 2847 PPM (Warning)       │    │
│ │ ⚠ 13:45 — CO briefly hit 51 PPM (Warning)          │    │
│ └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

BEHAVIOR:
- On page load → immediately call Groq API (POST /api/groq/insight)
  Show spinner in AI box while waiting, then animate text in
- Live readings update every 10 seconds
- Chart shows last 2 hours of data from DB
- Alert log shows last 10 alerts for this mine
```

---

### 3. Sensor Gauge Component (`SensorGauge.jsx`)
```
- Circular arc gauge (SVG based)
- Fills from 0 → current value → max range
- Color changes: green → yellow → red based on threshold
- Shows current numeric value in center
- Label below: "Methane (PPM)" etc.
- Smooth animated fill transition on value change
```

---

### 4. AI Insight Box (`AIInsightBox.jsx`)
```
- Card with subtle glowing border (amber colored)
- Robot/AI icon in top left
- "AI Safety Analysis" label
- While loading: animated shimmer skeleton
- On load: text appears with typewriter animation
- Small "Powered by Groq" badge at bottom right
- Refresh button to regenerate insight
```

---

## 🔁 DATA FLOW — Complete Step by Step

```
1. ESP8266 wakes up every 10 seconds
2. Reads MQ-4 (methane), MQ-7 (CO), DHT11 (temp, humidity)
3. POST → https://backend.onrender.com/api/sensor/data with JSON payload
4. Backend Flask receives data → looks up mine by device_id
5. Calculates overall status (SAFE/WARNING/DANGER) using thresholds
6. Saves reading to sensor_readings table in MySQL
7. If DANGER/WARNING → also saves to alerts table
8. Returns response {status, safety_status, alert_triggered} to ESP8266
9. ESP8266 sets LED color + buzzer accordingly

--- Meanwhile on the Frontend ---

10. Home page loads → GET /api/mines → renders all mine cards
11. Every 10s → re-fetches mine data → updates cards live
12. User clicks a mine card → navigate to /mine/1
13. Mine page loads:
    a. GET /api/mines/1 → mine details + last 50 readings
    b. GET /api/alerts/1 → recent alerts
    c. POST /api/groq/insight with current readings → AI text appears
14. Chart renders historical data from the readings array
15. Readings auto-refresh every 10s on mine detail page too
```

---

## 🌐 HOSTING & DEPLOYMENT

### Frontend → Vercel
```bash
# In /frontend directory:
npm run build
# Connect GitHub repo to Vercel
# Set environment variable: VITE_API_URL=https://your-backend.onrender.com
# Auto-deploys on every git push
```

### Backend → Render (Free Tier)
```bash
# In /backend directory:
# Render detects Python → runs: pip install -r requirements.txt
# Start command: gunicorn app:app
# Set environment variables in Render dashboard:
#   MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
#   GROQ_API_KEY
```

### Database → Railway (Free Tier)
```bash
# Create new MySQL project on Railway
# Copy connection string → use in backend .env
# Run schema.sql to set up tables
```

---

## 🔑 ENVIRONMENT VARIABLES

```bash
# backend/.env

# Database
MYSQL_HOST=your-db-host.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_db_password
MYSQL_DB=mineguard_db

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# App
FLASK_ENV=production
PORT=5000
```

```bash
# frontend/.env

VITE_API_URL=https://your-backend.onrender.com
```

---

## 🎁 OPTIONAL BONUS FEATURES (Add if time permits)

1. **Telegram Alert Bot** — When DANGER status triggered, bot sends message to a BCCL group
2. **CSV Export** — Download historical readings as CSV from mine detail page
3. **Worker Entry Log** — Manual input of how many workers entered the mine
4. **Shift Summary** — Auto-generate end-of-shift report using Groq
5. **Dark/Light mode toggle** — Though dark mode is default and recommended

---

## 📝 DUMMY DATA SIMULATION (for demo without real ESP8266)

Since only 1 real ESP8266 is available but 5 mines need to be shown, create a simulation script:

```python
# backend/simulate_sensors.py
# Run this script to generate fake data for mines 2-5
# Mine 1 gets real ESP8266 data, rest get simulated

import requests
import random
import time

DEVICES = ["ESP_002", "ESP_003", "ESP_004", "ESP_005"]
SERVER = "http://localhost:5000/api/sensor/data"

while True:
    for device in DEVICES:
        # Simulate mostly safe, occasionally warning values
        methane = random.uniform(200, 3000)
        co = random.uniform(5, 60)
        temp = random.uniform(24, 36)
        humidity = random.uniform(55, 88)
        
        payload = {
            "device_id": device,
            "methane_ppm": round(methane, 1),
            "co_ppm": round(co, 1),
            "temperature_c": round(temp, 1),
            "humidity_percent": round(humidity, 1)
        }
        
        requests.post(SERVER, json=payload)
        print(f"Sent data for {device}")
        time.sleep(1)
    
    time.sleep(10)  # Wait 10 seconds before next round
```

---

## ✅ BUILD ORDER / SEQUENCE

Follow this exact sequence to build the project:

```
PHASE 1 — DATABASE (Day 1)
  □ Set up MySQL on Railway
  □ Run schema.sql
  □ Verify tables created and seed data inserted

PHASE 2 — BACKEND (Day 1-2)
  □ Set up Flask project structure
  □ Implement DB connection (config.py, db.py)
  □ Build POST /api/sensor/data endpoint
  □ Build GET /api/mines endpoint
  □ Build GET /api/mines/<id> endpoint
  □ Build POST /api/groq/insight endpoint
  □ Build GET /api/alerts/<mine_id> endpoint
  □ Test all endpoints with Postman/curl
  □ Deploy to Render

PHASE 3 — SIMULATION SCRIPT (Day 2)
  □ Write and run simulate_sensors.py
  □ Verify data flowing into DB
  □ Verify status calculations working

PHASE 4 — FRONTEND (Day 2-4)
  □ Set up React + Vite + Tailwind
  □ Build Navbar
  □ Build Home page with mine cards (static first)
  □ Connect cards to live API data
  □ Build Mine Detail page (static layout first)
  □ Add SensorGauge components
  □ Add LiveChart with Recharts
  □ Add AIInsightBox with Groq call
  □ Add auto-refresh (polling every 10s)
  □ Add Alert log section
  □ Polish animations and transitions
  □ Deploy to Vercel

PHASE 5 — HARDWARE (Day 4-5)
  □ Wire ESP8266 + DHT11 + MQ-4 + MQ-7 + LEDs + Buzzer
  □ Upload main.ino with your WiFi + server URL
  □ Test data flowing from hardware to dashboard
  □ Verify LED/buzzer response to thresholds

PHASE 6 — INTEGRATION & POLISH (Day 5-6)
  □ Run full system end-to-end test
  □ Check all mine cards update live
  □ Verify Groq insights load correctly
  □ Final UI polish
  □ Record demo video
```

---

## 🏁 FINAL OUTPUT

When complete, you will have:
- ✅ A **live hosted URL** showing a professional multi-mine dashboard
- ✅ **Real IoT hardware** (ESP8266) sending data to the cloud
- ✅ **AI-powered insights** using Groq API
- ✅ **MySQL database** storing all historical readings
- ✅ **Simulation script** making all 5 mines feel alive
- ✅ A project that is **100% relevant to BCCL's real operations**
- ✅ Resume material covering: IoT, Full-Stack, REST API, AI Integration, Cloud Hosting

---

*Built during internship at BCCL (Bharat Coking Coal Limited) — Dhanbad, Jharkhand*
*Project by B.Tech CSE Intern under AGM, IT Division*
