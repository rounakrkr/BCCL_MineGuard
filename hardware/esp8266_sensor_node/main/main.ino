// hardware/esp8266_sensor_node/main.ino

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ===================== CONFIG =====================
const char* WIFI_SSID     = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
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
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
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

void setStatusLED(String status) {
  // Turn off all colors and buzzer first
  setRGBColor(LOW, LOW, LOW);
  noTone(BUZZER_PIN);
  
  if (status == "SAFE") {
    // Green
    setRGBColor(LOW, HIGH, LOW);
  } 
  else if (status == "WARNING") {
    // Yellow (Red + Green)
    setRGBColor(HIGH, HIGH, LOW);
  } 
  else if (status == "DANGER") {
    // Red
    setRGBColor(HIGH, LOW, LOW);
    
    // Sound buzzer
    tone(BUZZER_PIN, 1000);
    delay(500);
    noTone(BUZZER_PIN);
  }
}

void sendDataToServer(float methane, float co, float smoke, bool fire, float temp, float hum) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  WiFiClientSecure client;
  client.setInsecure();  // For HTTPS without cert verification
  HTTPClient http;
  
  http.begin(client, SERVER_URL);
  http.setTimeout(15000);  // 15 second timeout for slow Cloud DB responses
  http.addHeader("Content-Type", "application/json");
  
  // Build JSON payload (including new sensors)
  JsonDocument doc;  // Using latest ArduinoJson v7 syntax
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
  
  http.end();
}

// =================== MAIN LOOP ===================
void loop() {
  float methane = readMethane();
  float co      = readCO();
  float smoke   = readSmoke();
  
  // Flame sensors can output HIGH or LOW depending on the manufacturer. 
  // Changing to HIGH since your module seems to output LOW when idle.
  bool fireDetected = (digitalRead(FLAME_PIN) == HIGH); 
  
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
  
  if (methane >= METHANE_DANGER || co >= CO_DANGER || smoke >= SMOKE_DANGER || fireDetected) {
    status = "DANGER";
  } else if (methane >= METHANE_WARNING || co >= CO_WARNING || smoke >= SMOKE_WARNING) {
    status = "WARNING";
  }
  
  // Print to Serial Monitor
  Serial.printf("Methane: %.1f | CO: %.1f | Smoke: %.1f | Fire: %s | Temp: %.1f°C | Hum: %.1f%% | %s\n",
                methane, co, smoke, fireDetected ? "YES" : "NO", temp, hum, status.c_str());
  
  // Set LED / Buzzer
  setStatusLED(status);
  
  // Send to backend server
  sendDataToServer(methane, co, smoke, fireDetected, temp, hum);
  
  delay(10000);  // Send every 10 seconds
}
