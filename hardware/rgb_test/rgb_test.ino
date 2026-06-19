// hardware/rgb_test/rgb_test.ino

// RGB LED Pins
#define RGB_RED    D8
#define RGB_GREEN  D6
#define RGB_BLUE   D7

void setup() {
  pinMode(RGB_RED, OUTPUT);
  pinMode(RGB_GREEN, OUTPUT);
  pinMode(RGB_BLUE, OUTPUT);
  
  Serial.begin(115200);
  Serial.println("Starting RGB LED Test...");
}

void loop() {
  // 1. Test RED
  Serial.println("Turning ON: RED");
  digitalWrite(RGB_RED, HIGH);
  digitalWrite(RGB_GREEN, LOW);
  digitalWrite(RGB_BLUE, LOW);
  delay(2000); // Wait 2 seconds

  // 2. Test GREEN
  Serial.println("Turning ON: GREEN");
  digitalWrite(RGB_RED, LOW);
  digitalWrite(RGB_GREEN, HIGH);
  digitalWrite(RGB_BLUE, LOW);
  delay(2000);

  // 3. Test BLUE
  Serial.println("Turning ON: BLUE");
  digitalWrite(RGB_RED, LOW);
  digitalWrite(RGB_GREEN, LOW);
  digitalWrite(RGB_BLUE, HIGH);
  delay(2000);

  // 4. Test YELLOW (Red + Green)
  Serial.println("Turning ON: YELLOW (Red + Green)");
  digitalWrite(RGB_RED, HIGH);
  digitalWrite(RGB_GREEN, HIGH);
  digitalWrite(RGB_BLUE, LOW);
  delay(2000);

  // 5. ALL OFF
  Serial.println("Turning OFF ALL COLORS");
  digitalWrite(RGB_RED, LOW);
  digitalWrite(RGB_GREEN, LOW);
  digitalWrite(RGB_BLUE, LOW);
  delay(2000);
}
