// hardware/esp8266_sensor_node/main.ino

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ===================== CONFIG =====================
const char* WIFI_SSID     = "RounakKR";
const char* WIFI_PASSWORD = "nahipata";
const char* SERVER_URL    = "https://bccl-mineguard.onrender.com/api/sensor/data";
const char* DEVICE_ID     = "ESP_001";  // Change per device

// ===================== PINS =======================
#define ANALOG_PIN A0    // Common analog pin connected to Multiplexer Z
#define DHT_PIN    D4    // DHT11 data pin
#define BUZZER_PIN D5    // Buzzer
#define FLAME_PIN  D0    // IR Flame Sensor Digital Out

// RGB LED Pins
#define RGB_RED    D8
#define RGB_GREEN  D6
#define RGB_BLUE   D7

// Set this to true if your RGB LED is Common Anode (Longest pin connected to 3.3V)
// Set this to false if your RGB LED is Common Cathode (Longest pin connected to GND)
bool isCommonAnode = false; 

// Multiplexer Control Pins (S0, S1, S2)
#define MUX_S0 D1
#define MUX_S1 D2
#define MUX_S2 D3

#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);

// ===================== THRESHOLDS =================
#define METHANE_WARNING  3500
#define METHANE_DANGER   4500
#define CO_WARNING       300
#define CO_DANGER        400
#define SMOKE_WARNING    3800
#define SMOKE_DANGER     4500

// =================== SETUP =======================
void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RGB_RED, OUTPUT);
  pinMode(RGB_GREEN, OUTPUT);
  pinMode(RGB_BLUE, OUTPUT);
  
  pinMode(FLAME_PIN, INPUT);
  
  // Set Multiplexer control pins as outputs
  pinMode(MUX_S0, OUTPUT);
  pinMode(MUX_S1, OUTPUT);
  pinMode(MUX_S2, OUTPUT);
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  
  // Try connecting for 15 seconds (30 * 500ms)
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\nWiFi Failed! Starting in Offline Hardware Mode...");
  }
}

// =================== HELPERS =====================
int readMultiplexer(int channel) {
  // Set multiplexer channel (0 to 7) using bitwise operations
  digitalWrite(MUX_S0, bitRead(channel, 0));
  digitalWrite(MUX_S1, bitRead(channel, 1));
  digitalWrite(MUX_S2, bitRead(channel, 2));
  
  // Give multiplexer a few milliseconds to settle
  delay(10);
  
  // Read the analog value
  return analogRead(ANALOG_PIN);
}

float readMethane() {
  // MQ-4 is on Channel 0
  int raw = readMultiplexer(0);
  return map(raw, 0, 1023, 0, 10000);  // Simplified mapping
}

float readCO() {
  // MQ-7 is on Channel 1
  int raw = readMultiplexer(1);
  return map(raw, 0, 1023, 0, 1000);   // Simplified mapping
}

float readSmoke() {
  // MQ-2 is on Channel 2
  int raw = readMultiplexer(2);
  return map(raw, 0, 1023, 0, 10000);  // Simplified mapping
}

// Helper to set RGB color based on Common Anode/Cathode
void setRGBColor(int redVal, int greenVal, int blueVal) {
  if (isCommonAnode) {
    // Common Anode: LOW turns LED ON, HIGH turns it OFF
    digitalWrite(RGB_RED, !redVal);
    digitalWrite(RGB_GREEN, !greenVal);
    digitalWrite(RGB_BLUE, !blueVal);
  } else {
    // Common Cathode: HIGH turns LED ON, LOW turns it OFF
    digitalWrite(RGB_RED, redVal);
    digitalWrite(RGB_GREEN, greenVal);
    digitalWrite(RGB_BLUE, blueVal);
  }
}

bool isBuzzing = false;
unsigned long lastBeepToggle = 0;
bool beepState = false;

void setStatusLED(String status) {
  // Turn off all colors first
  setRGBColor(LOW, LOW, LOW);
  
  if (status == "SAFE") {
    // Green
    setRGBColor(LOW, HIGH, LOW);
    if (isBuzzing) {
      noTone(BUZZER_PIN);
      isBuzzing = false;
    }
  } 
  else if (status == "WARNING") {
    // Yellow (Red + Green)
    setRGBColor(HIGH, HIGH, LOW);
    
    // Beep every 500ms
    if (millis() - lastBeepToggle >= 500) {
      beepState = !beepState;
      lastBeepToggle = millis();
      
      if (beepState) {
        tone(BUZZER_PIN, 1000);
        isBuzzing = true;
      } else {
        noTone(BUZZER_PIN);
        isBuzzing = false;
      }
    }
  } 
  else if (status == "DANGER") {
    // Red
    setRGBColor(HIGH, LOW, LOW);
    
    // Continuous buzz - ONLY call tone() if it's not already buzzing
    // Calling tone() repeatedly in a fast loop stops it from making sound!
    if (!isBuzzing) {
      tone(BUZZER_PIN, 1000);
      isBuzzing = true;
    }
  }
}

// Global WiFi Client with Session Caching for Ultra-Fast HTTPS
WiFiClientSecure client;
BearSSL::Session session;
HTTPClient http;

void sendDataToServer(float methane, float co, float smoke, bool fire, float temp, float hum) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  client.setInsecure();  
  client.setSession(&session); // Restores previous SSL session to skip 5-second handshake!
  
  http.begin(client, SERVER_URL);
  // Do not use setReuse(true) as Render load balancers drop idle connections, 
  // causing every alternate request to hang and timeout!
  http.setTimeout(5000); // 5 second timeout max
  http.addHeader("Content-Type", "application/json");
  
  JsonDocument doc;
  doc["device_id"]       = DEVICE_ID;
  doc["methane_ppm"]     = methane;
  doc["co_ppm"]          = co;
  doc["smoke_ppm"]       = smoke;
  doc["fire_detected"]   = fire;
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
  
  // Do NOT call http.end() if we want to reuse the connection!
  // But wait, HTTPClient documentation says calling end() is required to free resources.
  // Actually, keeping the payload small allows reuse even if we call end() ?
  // Yes, with setReuse(true), end() keeps the TCP socket open internally!
  http.end(); 
}

// =================== MAIN LOOP ===================
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // 10 seconds

// Global variables for non-blocking DHT
unsigned long lastDHTReadTime = 0;
float lastTemp = 24.0;
float lastHum = 50.0;

void loop() {
  float methane = readMethane();
  float co      = readCO();
  float smoke   = readSmoke();
  
  // Flame sensors can output HIGH or LOW depending on the manufacturer. 
  // Changing to HIGH since your module seems to output LOW when idle.
  bool fireDetected = (digitalRead(FLAME_PIN) == HIGH); 
  
  unsigned long currentMillis = millis();
  
  // DHT11 sensors can only be read once every 2 seconds. 
  // Reading them faster causes them to fail and freeze the loop.
  if (currentMillis - lastDHTReadTime >= 2000 || lastDHTReadTime == 0) {
    float temp    = dht.readTemperature();
    float hum     = dht.readHumidity();
    
    if (!isnan(temp) && !isnan(hum)) {
      lastTemp = temp;
      lastHum = hum;
    } else {
      Serial.println("DHT read failed, keeping old values...");
    }
    lastDHTReadTime = currentMillis;
  }
  
  // Determine local status
  String status = "SAFE";
  
  if (methane >= METHANE_DANGER || co >= CO_DANGER || smoke >= SMOKE_DANGER || fireDetected) {
    status = "DANGER";
  } else if (methane >= METHANE_WARNING || co >= CO_WARNING || smoke >= SMOKE_WARNING) {
    status = "WARNING";
  }
  
  // Set LED / Buzzer in REAL-TIME
  setStatusLED(status);
  
  // Send data to backend ONLY every 10 seconds
  if (currentMillis - lastSendTime >= sendInterval || lastSendTime == 0) {
    lastSendTime = currentMillis;
    
    // Print to Serial Monitor
    Serial.printf("Methane: %.1f | CO: %.1f | Smoke: %.1f | Fire: %s | Temp: %.1f°C | Hum: %.1f%% | %s\n",
                  methane, co, smoke, fireDetected ? "YES" : "NO", lastTemp, lastHum, status.c_str());
                  
    // Send to backend server
    sendDataToServer(methane, co, smoke, fireDetected, lastTemp, lastHum);
  }
  
  delay(100);  // Small delay for system stability
}
