export const ESP32_ARDUINO_SKETCH = `/*
 * AcetoSense - ESP32 Firmware for Breath Acetone Sensing Prototype
 * Target Microcontroller: ESP32 DevKit V1 / NodeMCU-32S
 * Sensors: MQ-138 (or TGS822 / SGP40) Gas Sensor + DHT22 / BME280 Environment Sensor
 *
 * Wiring Diagram:
 *  - MQ-138 Analog Out (AO) -> ESP32 GPIO 36 (VP / ADC1_CH0)
 *  - MQ-138 VCC             -> 5V (from USB or external power supply)
 *  - MQ-138 GND             -> ESP32 GND
 *  - DHT22 Data             -> ESP32 GPIO 4 (with 10k pull-up resistor to 3.3V)
 *  - DHT22 VCC              -> 3.3V / 5V
 *  - DHT22 GND              -> ESP32 GND
 *
 * Baud Rate: 115200 bps
 * Output Format: Single-line JSON emitted at 1 Hz
 * Example: {"acetone_raw":512,"temperature_c":28.5,"humidity_pct":62.0}
 */

#include <Arduino.h>

// Pin Definitions
#define SENSOR_PIN 36        // GPIO36 / ADC1_CH0 (MQ-138 Analog Out)
#define STATUS_LED_PIN 2     // Onboard Blue LED

// Configuration
const unsigned long EMIT_INTERVAL_MS = 1000;
unsigned long lastEmitTime = 0;
float baselineAdc = 450.0;   // Baseline clean-air ADC value

void setup() {
  // Initialize USB Serial CDC at 115200 baud
  Serial.begin(115200);
  delay(1000);

  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, HIGH);

  // Configure ADC resolution (12-bit = 0 to 4095)
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db); // Full-scale range ~0 to 3.3V

  Serial.println("{\\"status\\":\\"booted\\",\\"device\\":\\"AcetoSense_ESP32\\",\\"version\\":\\"1.0.4\\"}");
  digitalWrite(STATUS_LED_PIN, LOW);
}

void loop() {
  unsigned long currentMillis = millis();

  // Read incoming commands from web dashboard
  if (Serial.available() > 0) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    if (cmd == "PING") {
      Serial.println("{\\"reply\\":\\"PONG\\",\\"uptime_ms\\":" + String(currentMillis) + "}");
    } else if (cmd == "CALIB") {
      // Re-sample ambient air to set baseline
      long sum = 0;
      for (int i = 0; i < 20; i++) {
        sum += analogRead(SENSOR_PIN);
        delay(10);
      }
      baselineAdc = sum / 20.0;
      Serial.println("{\\"calib_status\\":\\"baseline_stored\\",\\"baseline_adc\\":" + String(baselineAdc) + "}");
    }
  }

  // Periodic sensor sampling and emission
  if (currentMillis - lastEmitTime >= EMIT_INTERVAL_MS) {
    lastEmitTime = currentMillis;

    // Multi-sample analog averaging to filter electrical ripple
    long rawSum = 0;
    const int SAMPLES = 16;
    for (int i = 0; i < SAMPLES; i++) {
      rawSum += analogRead(SENSOR_PIN);
      delayMicroseconds(250);
    }
    int acetoneRaw = rawSum / SAMPLES;

    // Environmental readings (replace with actual DHT22 / BME280 read calls)
    // float temperatureC = dht.readTemperature();
    // float humidityPct = dht.readHumidity();
    float temperatureC = 28.2; // Ambient lab temperature in Celsius
    float humidityPct = 61.5;  // Ambient relative humidity percentage

    // Flash onboard indicator LED briefly during telemetry transmission
    digitalWrite(STATUS_LED_PIN, HIGH);

    // Emit standardized single-line JSON packet
    Serial.print("{\\"acetone_raw\\":");
    Serial.print(acetoneRaw);
    Serial.print(",\\"temperature_c\\":");
    Serial.print(temperatureC, 1);
    Serial.print(",\\"humidity_pct\\":");
    Serial.print(humidityPct, 1);
    Serial.println("}");

    digitalWrite(STATUS_LED_PIN, LOW);
  }
}
`;

export function downloadSketchFile() {
  const blob = new Blob([ESP32_ARDUINO_SKETCH], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'AcetoSense_ESP32.ino';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
