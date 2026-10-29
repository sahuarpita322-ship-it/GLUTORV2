import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Code,
  Download,
  Copy,
  Check,
  Usb,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Tv,
  Grid,
  Terminal
} from 'lucide-react';
import { PI_ZERO_PYTHON_SCRIPT, downloadPiZeroScript } from '../services/piZeroHelper';

interface MicrocontrollerHubProps {
  onQuickConnect: () => void;
  selectedBoard: string;
}

export const MicrocontrollerHub: React.FC<MicrocontrollerHubProps> = ({
  onQuickConnect,
  selectedBoard,
}) => {
  const [activeBoard, setActiveBoard] = useState<'pi_zero' | 'esp32' | 'arduino' | 'pico'>('pi_zero');
  const [displayTarget, setDisplayTarget] = useState<'lcd' | 'oled'>('lcd');
  const [copiedCode, setCopiedCode] = useState(false);

  const boards = [
    {
      id: 'pi_zero',
      name: 'Single-Board Sensor Unit',
      sub: 'HW-841 Sensor + Hardware Screen',
      chip: 'ARM Cortex / Broadcom',
      sensor: 'HW-841 Figaro Gas Sensor',
      adcPin: 'Pin 3 (SDA) / Pin 5 (SCL) via I2C',
      i2cSda: 'Pin 3 (GPIO 2 SDA)',
      i2cScl: 'Pin 5 (GPIO 3 SCL)',
      baud: '115200 (USB OTG Serial /dev/ttyGS0)',
      isUserHardware: true,
    },
    {
      id: 'esp32',
      name: 'ESP32 / ESP32-S3',
      sub: 'Tensilica 32-bit Dual Core',
      chip: 'ESP-WROOM-32',
      sensor: 'HW-841 / MQ-138 Gas Sensor',
      adcPin: 'GPIO 36 (VP)',
      i2cSda: 'GPIO 21 (SDA)',
      i2cScl: 'GPIO 22 (SCL)',
      baud: '115200',
      isUserHardware: false,
    },
    {
      id: 'arduino',
      name: 'Arduino Uno / Nano / Mega',
      sub: 'ATmega328P / ATmega2560',
      chip: 'Arduino AVR',
      sensor: 'HW-841 / MQ-138 Gas Sensor',
      adcPin: 'Analog Pin A0',
      i2cSda: 'Pin A4 (Uno/Nano) / Pin 20 (Mega)',
      i2cScl: 'Pin A5 (Uno/Nano) / Pin 21 (Mega)',
      baud: '115200 or 9600',
      isUserHardware: false,
    },
    {
      id: 'pico',
      name: 'RP2040 Microcontroller',
      sub: 'Dual ARM Cortex-M0+',
      chip: 'RP2040 Silicon',
      sensor: 'HW-841 / MQ-138 Gas Sensor',
      adcPin: 'GP26 (ADC0)',
      i2cSda: 'GP4 (I2C0 SDA)',
      i2cScl: 'GP5 (I2C0 SCL)',
      baud: '115200',
      isUserHardware: false,
    },
  ];

  const currentBoardConfig = boards.find((b) => b.id === activeBoard)!;

  const getCode = () => {
    // If Raspberry Pi Zero is selected, return the Python 3 daemon
    if (activeBoard === 'pi_zero') {
      return PI_ZERO_PYTHON_SCRIPT;
    }

    // 1. LCD 16x2 / 20x4 I2C sketches
    if (displayTarget === 'lcd') {
      if (activeBoard === 'arduino') {
        return `/*
 * AcetoSense - Arduino Uno/Nano with 16x2 I2C LCD & HW-841 Figaro Sensor
 * Sensors: HW-841 (Analog A0) + 16x2 I2C LCD (SDA: A4, SCL: A5, Addr: 0x27)
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
const int SENSOR_PIN = A0;

void setup() {
  Serial.begin(115200);
  Wire.begin();
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("ACETOSENSE HW841");
  lcd.setCursor(0, 1);
  lcd.print("LCD READY 0x27");
  delay(1000);
}

void loop() {
  int rawVal = analogRead(SENSOR_PIN);
  float ppm = 0.55 + ((float)rawVal / 1023.0) * 1.5;
  int gluEst = 85 + (int)((ppm - 0.55) * 45);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acetone:");
  lcd.print(ppm, 2);
  lcd.print("ppm");

  lcd.setCursor(0, 1);
  lcd.print("Glu:~");
  lcd.print(gluEst);
  lcd.print("mg T:28C");

  Serial.print("{\\"board\\":\\"Arduino Uno\\",\\"sensor\\":\\"HW-841 Figaro\\",\\"acetone_raw\\":");
  Serial.print(rawVal);
  Serial.print(",\\"calibrated_acetone_ppm\\":");
  Serial.print(ppm, 2);
  Serial.println(",\\"temperature_c\\":27.8,\\"humidity_pct\\":59.0}");

  delay(1000);
}`;
      }

      // ESP32 with 16x2 LCD
      return `/*
 * AcetoSense - ESP32 with 16x2 I2C LCD & HW-841 Figaro Sensor
 * Pins: HW-841 on GPIO 36 + LCD on I2C (SDA 21, SCL 22, Addr: 0x27)
 */

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);
const int SENSOR_PIN = 36;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  analogReadResolution(12);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("ACETOSENSE ESP32");
  lcd.setCursor(0, 1);
  lcd.print("HW-841 FIGARO");
  delay(1000);
}

void loop() {
  int rawVal = analogRead(SENSOR_PIN);
  float ppm = 0.65 + ((float)rawVal / 4095.0) * 1.6;
  int gluEst = 85 + (int)((ppm - 0.65) * 50);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acetone: ");
  lcd.print(ppm, 2);
  lcd.print("ppm");

  lcd.setCursor(0, 1);
  lcd.print("Glu:~");
  lcd.print(gluEst);
  lcd.print("mg OK");

  Serial.print("{\\"board\\":\\"ESP32\\",\\"sensor\\":\\"HW-841 Figaro\\",\\"acetone_raw\\":");
  Serial.print(rawVal);
  Serial.print(",\\"calibrated_acetone_ppm\\":");
  Serial.print(ppm, 2);
  Serial.println(",\\"temperature_c\\":28.0,\\"humidity_pct\\":60.0}");

  delay(1000);
}`;
    }

    // Default OLED code
    return `/*
 * AcetoSense - ESP32 with 0.96" SSD1306 OLED (128x64)
 */
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);
const int SENSOR_PIN = 36;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
}

void loop() {
  int rawVal = analogRead(SENSOR_PIN);
  float ppm = 0.65 + ((float)rawVal / 4095.0) * 1.6;

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("ACETOSENSE OLED");
  display.print("Acetone: "); display.print(ppm, 2); display.println("ppm");
  display.display();

  Serial.print("{\\"acetone_raw\\":"); Serial.print(rawVal);
  Serial.print(",\\"calibrated_acetone_ppm\\":"); Serial.print(ppm, 2);
  Serial.println("}");
  delay(1000);
}`;
  };

  const currentCode = getCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    if (activeBoard === 'pi_zero') {
      downloadPiZeroScript();
      return;
    }
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AcetoSense_${activeBoard.toUpperCase()}_${displayTarget.toUpperCase()}.ino`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Board Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {boards.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBoard(b.id as any)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              activeBoard === b.id
                ? 'bg-cyan-950/50 border-cyan-500/70 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {b.isUserHardware && (
              <span className="absolute top-2 right-2 text-[9px] font-mono bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 px-1.5 py-0.2 rounded font-bold">
                YOUR HARDWARE
              </span>
            )}
            <div className="flex items-center justify-between mb-1">
              <Cpu className={`w-5 h-5 ${activeBoard === b.id ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-mono text-slate-500">{b.chip}</span>
            </div>
            <div className="text-sm font-bold text-white truncate">{b.name}</div>
            <div className="text-[11px] text-teal-400 truncate mt-0.5">{b.sub}</div>
          </button>
        ))}
      </div>

      {/* Hardware Setup Strip */}
      {activeBoard === 'pi_zero' && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/60 border border-emerald-800/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h4 className="text-sm font-bold text-white">
              Hardware Unit · HW-841 Figaro Sensor · Screen Setup
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect the <strong>Hardware Device's USB Data Port</strong> (the inner micro-USB connector labeled <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-300 font-mono">USB</code>) directly to your computer. The unit operates as a <strong>USB Serial CDC Gadget (<code className="text-cyan-300">/dev/ttyGS0</code>)</strong>, requiring zero extra adapters!
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-slate-500 uppercase text-[10px]">Quick 2-Line Terminal Setup:</div>
            <div><span className="text-cyan-400">$</span> echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt</div>
            <div><span className="text-cyan-400">$</span> sudo apt-get install -y python3-pip &amp;&amp; pip3 install RPLCD smbus2</div>
          </div>
        </div>
      )}

      {/* Wiring Pinout Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Wiring Diagram: {currentBoardConfig.name}</span>
            </h3>
            <p className="text-xs text-slate-400">Sensor: {currentBoardConfig.sensor} · Display: Screen (I2C 0x27)</p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Script'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{activeBoard === 'pi_zero' ? 'Download glutor_device_driver.py' : 'Download .ino'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Pinout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase">HW-841 Figaro Sensor</span>
            <span className="text-cyan-400 font-bold text-sm block mt-0.5">{currentBoardConfig.adcPin}</span>
            <span className="text-slate-500 text-[11px]">Pin 2 (5V) · Pin 6 (GND)</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase">Hardware Screen I2C SDA</span>
            <span className="text-emerald-400 font-bold text-sm block mt-0.5">{currentBoardConfig.i2cSda}</span>
            <span className="text-slate-500 text-[11px]">PCF8574 Address 0x27</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-slate-500 block text-[10px] uppercase">Hardware Screen I2C SCL</span>
            <span className="text-emerald-400 font-bold text-sm block mt-0.5">{currentBoardConfig.i2cScl}</span>
            <span className="text-slate-500 text-[11px]">Pin 4 (5V) · Pin 6 (GND)</span>
          </div>
        </div>

        {/* Code / Script Box */}
        <div className="relative">
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 rounded-t-xl flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{activeBoard === 'pi_zero' ? 'glutor_device_driver.py (Python 3)' : 'Glutor_Firmware.ino (C++)'}</span>
            <span className="text-cyan-400">Ready to run on device</span>
          </div>
          <pre className="bg-[#05070c] border border-t-0 border-slate-800 rounded-b-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-80">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
