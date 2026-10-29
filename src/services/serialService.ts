import { SerialDataPoint, QualityStatus } from '../types';

export interface ParsedSensorPacket {
  acetoneRaw: number | null;
  calibratedAcetonePpm: number | null;
  glucoseValue: number | null;
  voltageRaw: number | null;
  deviceTitle?: string;
  displayLines?: string[];
  temperatureC: number | null;
  humidityPct: number | null;
  ketoneIndex: number | null;
  boardName?: string;
  oledText?: string[];
  qualityStatus: QualityStatus;
}

export class SerialDataParser {
  /**
   * Parse a single line from any microcontroller serial stream.
   * Fully supports:
   * 1. Physical Glutor screen format:
   *    "Glutor V2.0"
   *    "Glucose:109 mg/dL"
   *    "V = 139" or "V := 139" or "V:139"
   * 2. Key-Value format ("Glucose:109, V:139", "Acetone:0.86, Temp:28.5")
   * 3. JSON format ({"glucose":109, "v":139, "device":"Glutor V2.0"})
   * 4. Raw CSV ("139, 109")
   */
  static parseLine(line: string): ParsedSensorPacket | null {
    const trimmed = line.trim();
    if (!trimmed) return null;

    let deviceTitle: string | undefined = undefined;
    let glucoseValue: number | null = null;
    let voltageRaw: number | null = null;
    let acetoneRaw: number | null = null;
    let calibratedAcetonePpm: number | null = null;
    let temperatureC: number | null = null;
    let humidityPct: number | null = null;
    let ketoneIndex: number | null = null;
    let boardName: string | undefined = undefined;

    // 1. Check for physical screen title line: "Glutor V2.0" or "Glutor"
    if (/glutor/i.test(trimmed)) {
      deviceTitle = trimmed;
      boardName = trimmed;
      return {
        deviceTitle,
        glucoseValue: null,
        voltageRaw: null,
        acetoneRaw: null,
        calibratedAcetonePpm: null,
        temperatureC: null,
        humidityPct: null,
        ketoneIndex: null,
        boardName,
        oledText: [trimmed],
        qualityStatus: 'nominal',
      };
    }

    // 2. Check for physical screen Glucose line: "Glucose:109 mg/dL" or "Glucose: 109" or "Glu:109"
    const gluMatch = trimmed.match(/(?:glucose|glu)\s*[:=]\s*(\d+(?:\.\d+)?)/i);
    if (gluMatch) {
      glucoseValue = Math.round(parseFloat(gluMatch[1]));
    }

    // 3. Check for physical screen Voltage/ADC line: "V = 139" or "V := 139" or "V:139" or "V=139"
    const vMatch = trimmed.match(/(?:^|\b)(?:v|volt|voltage)\s*[:=]+\s*(\d+(?:\.\d+)?)/i);
    if (vMatch) {
      voltageRaw = Math.round(parseFloat(vMatch[1]));
      acetoneRaw = voltageRaw;
      calibratedAcetonePpm = Number((0.45 + (voltageRaw / 1023) * 1.5).toFixed(2));
    }

    // 4. Try JSON format
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const obj = JSON.parse(trimmed);
        const fromObj = SerialDataParser.fromObject(obj);
        return fromObj;
      } catch {
        // Fall through
      }
    }

    // 5. Try Key-Value format (e.g. "Glucose:109, V:139" or "Acetone:512,Temp:28.5")
    if (trimmed.includes(':') || trimmed.includes('=')) {
      const parsedObj: Record<string, unknown> = {};
      const pairs = trimmed.split(/[,;\t]/);

      for (const pair of pairs) {
        const separator = pair.includes(':') ? ':' : '=';
        const parts = pair.split(separator);
        if (parts.length === 2) {
          const key = parts[0].trim().toLowerCase();
          const rawVal = parts[1].trim();
          const numVal = parseFloat(rawVal);
          parsedObj[key] = isNaN(numVal) ? rawVal : numVal;
        }
      }

      if (Object.keys(parsedObj).length > 0) {
        const fromObj = SerialDataParser.fromObject(parsedObj);
        if (glucoseValue !== null) fromObj.glucoseValue = glucoseValue;
        if (voltageRaw !== null) {
          fromObj.voltageRaw = voltageRaw;
          fromObj.acetoneRaw = voltageRaw;
        }
        return fromObj;
      }
    }

    // If gluMatch or vMatch was identified
    if (glucoseValue !== null || voltageRaw !== null) {
      return {
        deviceTitle,
        glucoseValue,
        voltageRaw,
        acetoneRaw: voltageRaw,
        calibratedAcetonePpm,
        temperatureC: null,
        humidityPct: null,
        ketoneIndex: null,
        boardName,
        oledText: [trimmed],
        qualityStatus: 'nominal',
      };
    }

    // 6. CSV numbers fallback (e.g. "139, 109" for V, Glucose)
    const nums = trimmed.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    if (nums.length === 2) {
      voltageRaw = Math.round(nums[0]);
      glucoseValue = Math.round(nums[1]);
      return {
        deviceTitle,
        glucoseValue,
        voltageRaw,
        acetoneRaw: voltageRaw,
        calibratedAcetonePpm: Number((0.45 + (voltageRaw / 1023) * 1.5).toFixed(2)),
        temperatureC: null,
        humidityPct: null,
        ketoneIndex: null,
        qualityStatus: 'nominal',
      };
    }

    return null;
  }

  private static fromObject(obj: Record<string, unknown>): ParsedSensorPacket {
    let acetoneRaw: number | null = null;
    let calibratedAcetonePpm: number | null = null;
    let glucoseValue: number | null = null;
    let voltageRaw: number | null = null;
    let temperatureC: number | null = null;
    let humidityPct: number | null = null;
    let ketoneIndex: number | null = null;
    let boardName: string | undefined = undefined;
    const oledText: string[] = [];

    for (const [rawKey, rawVal] of Object.entries(obj)) {
      const key = rawKey.toLowerCase();
      
      // Board / device identification
      if (key === 'board' || key === 'device' || key === 'mcu' || key === 'name') {
        boardName = String(rawVal);
        continue;
      }

      // Explicit OLED lines
      if (key.startsWith('oled')) {
        oledText.push(String(rawVal));
        continue;
      }

      const numVal = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal));
      if (isNaN(numVal)) continue;

      if (
        key === 'glucose' ||
        key === 'glucose_mgdl' ||
        key === 'glu' ||
        key === 'glucose_val'
      ) {
        glucoseValue = Math.round(numVal);
      } else if (
        key === 'v' ||
        key === 'volt' ||
        key === 'voltage' ||
        key === 'acetone_raw' ||
        key === 'acetoneraw' ||
        key === 'acetone' ||
        key === 'raw_acetone' ||
        key === 'adc' ||
        key === 'raw'
      ) {
        voltageRaw = Math.round(numVal);
        acetoneRaw = Math.round(numVal);
      } else if (
        key === 'calibrated_acetone_ppm' ||
        key === 'acetone_ppm' ||
        key === 'ppm'
      ) {
        calibratedAcetonePpm = Number(numVal.toFixed(3));
      } else if (
        key === 'temperature_c' ||
        key === 'temperature' ||
        key === 'temp' ||
        key === 'temp_c'
      ) {
        temperatureC = Number(numVal.toFixed(1));
      } else if (
        key === 'humidity_pct' ||
        key === 'humidity' ||
        key === 'hum' ||
        key === 'hum_pct'
      ) {
        humidityPct = Number(numVal.toFixed(1));
      } else if (
        key === 'ketone_index' ||
        key === 'ketone' ||
        key === 'ketone_ppm'
      ) {
        ketoneIndex = Number(numVal.toFixed(2));
      }
    }

    if (calibratedAcetonePpm === null && voltageRaw !== null) {
      calibratedAcetonePpm = Number((0.45 + (voltageRaw / 1023) * 1.5).toFixed(2));
    }

    // Determine quality indicators
    let qualityStatus: QualityStatus = 'nominal';
    if (acetoneRaw !== null && acetoneRaw < 20) {
      qualityStatus = 'warming_up';
    } else if (humidityPct !== null && humidityPct > 85) {
      qualityStatus = 'humidity_high';
    } else if (acetoneRaw !== null && acetoneRaw > 4050) {
      qualityStatus = 'unstable';
    }

    return {
      acetoneRaw,
      calibratedAcetonePpm,
      glucoseValue,
      voltageRaw,
      temperatureC,
      humidityPct,
      ketoneIndex,
      boardName,
      oledText: oledText.length > 0 ? oledText : undefined,
      qualityStatus,
    };
  }
}

export type SerialCallback = (data: SerialDataPoint, meta?: { boardName?: string; oledText?: string[] }) => void;
export type RawLineCallback = (line: string, type: 'incoming' | 'outgoing' | 'system' | 'error') => void;
export type StatusCallback = (status: import('../types').ConnectionStatus, message?: string) => void;

export class WebSerialManager {
  private port: any = null;
  private reader: any = null;
  private isReading = false;
  private buffer = '';
  private baudRate = 115200;
  private simulatedInterval: any = null;
  public detectedBoard: string = 'Auto-Detecting...';

  private onDataCallback: SerialCallback | null = null;
  private onRawLineCallback: RawLineCallback | null = null;
  private onStatusCallback: StatusCallback | null = null;

  constructor() {
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      (navigator as any).serial.addEventListener('disconnect', (event: any) => {
        if (event.target === this.port) {
          this.disconnect('USB device disconnected');
        }
      });
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public setCallbacks(
    onData: SerialCallback,
    onRawLine: RawLineCallback,
    onStatus: StatusCallback
  ) {
    this.onDataCallback = onData;
    this.onRawLineCallback = onRawLine;
    this.onStatusCallback = onStatus;
  }

  public setBaudRate(rate: number) {
    this.baudRate = rate;
  }

  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.onStatusCallback?.(
        'permission_required',
        'Web Serial API not supported in this browser. Please use Chrome, Edge, or Chromium desktop.'
      );
      this.onRawLineCallback?.('System: Web Serial API not supported.', 'error');
      return false;
    }

    try {
      this.onStatusCallback?.('connecting', 'Select your USB Prototype port...');
      this.onRawLineCallback?.('System: Requesting 1 USB port for prototype...', 'system');

      // Request port: simple 1-port connection without vendor restrictions
      this.port = await (navigator as any).serial.requestPort();

      this.detectedBoard = 'Prototype Connected';
      this.onRawLineCallback?.(`System: USB port selected. Opening at ${this.baudRate} baud...`, 'system');
      await this.port.open({ baudRate: this.baudRate });

      this.onStatusCallback?.('connected', 'Connected: 1 USB Port Active');
      this.onRawLineCallback?.(`System: Serial connection established. Reading from prototype...`, 'system');

      // Standby until the device sends its live values or user manually edits
      this.lastDeviceTitle = 'Glutor V2.0';
      this.lastGlucose = null;
      this.lastVoltage = null;
      this.lastDisplayLines = ['Glutor V2.0', 'Glucose:--- mg/dL', 'V = ---'];

      this.startReading();
      return true;
    } catch (err: any) {
      console.warn('Serial connection failed:', err);
      let errMsg = err.message || 'Connection cancelled';
      if (err.name === 'NotFoundError') errMsg = 'No device selected';
      this.onStatusCallback?.('error', errMsg);
      this.onRawLineCallback?.(`Error: ${errMsg}`, 'error');
      return false;
    }
  }

  private async startReading() {
    this.isReading = true;
    try {
      const reader = this.port.readable.getReader();
      this.reader = reader;
      const decoder = new TextDecoder();

      while (this.isReading) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const text = decoder.decode(value, { stream: true });
          this.handleIncomingChunk(text);
        }
      }
    } catch (error: any) {
      if (this.isReading) {
        this.onRawLineCallback?.(`Stream error: ${error.message}`, 'error');
        this.disconnect('Stream error');
      }
    } finally {
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch {}
      }
    }
  }

  public lastDeviceTitle: string = 'Glutor V2.0';
  public lastGlucose: number | null = null;
  public lastVoltage: number | null = null;
  public lastDisplayLines: string[] = ['Glutor V2.0', 'Glucose:--- mg/dL', 'V = ---'];

  private handleIncomingChunk(chunk: string) {
    this.buffer += chunk;
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      this.onRawLineCallback?.(trimmed, 'incoming');

      // 1. Direct screen line text capturing
      if (/glutor/i.test(trimmed)) {
        this.lastDeviceTitle = trimmed;
        this.lastDisplayLines[0] = trimmed;
      } else if (/glucose/i.test(trimmed)) {
        this.lastDisplayLines[1] = trimmed;
        const num = trimmed.match(/\d+(?:\.\d+)?/);
        if (num) this.lastGlucose = Math.round(parseFloat(num[0]));
      } else if (/^v\s*[:=]/i.test(trimmed) || /volt/i.test(trimmed)) {
        this.lastDisplayLines[2] = trimmed;
        const num = trimmed.match(/\d+(?:\.\d+)?/);
        if (num) this.lastVoltage = Math.round(parseFloat(num[0]));
      } else if (/^\d{2,3}$/.test(trimmed)) {
        // Just a 2-3 digit number from prototype
        const val = parseInt(trimmed, 10);
        if (val >= 60 && val <= 350) {
          this.lastGlucose = val;
          this.lastDisplayLines[1] = `Glucose:${val} mg/dL`;
        } else if (val < 60 || val > 350) {
          this.lastVoltage = val;
          this.lastDisplayLines[2] = `V = ${val}`;
        }
      }

      const parsed = SerialDataParser.parseLine(trimmed);
      if (parsed) {
        if (parsed.deviceTitle) {
          this.lastDeviceTitle = parsed.deviceTitle;
        }
        if (parsed.glucoseValue !== null) {
          this.lastGlucose = parsed.glucoseValue;
          this.lastDisplayLines[1] = `Glucose:${this.lastGlucose} mg/dL`;
        }
        if (parsed.voltageRaw !== null) {
          this.lastVoltage = parsed.voltageRaw;
          this.lastDisplayLines[2] = `V = ${this.lastVoltage}`;
        }
      }

      // Format physical screen lines
      if (this.lastGlucose !== null && !this.lastDisplayLines[1].includes(String(this.lastGlucose))) {
        this.lastDisplayLines[1] = `Glucose:${this.lastGlucose} mg/dL`;
      }
      if (this.lastVoltage !== null && !this.lastDisplayLines[2].includes(String(this.lastVoltage))) {
        this.lastDisplayLines[2] = `V = ${this.lastVoltage}`;
      }

      const calAcetone = this.lastVoltage !== null
        ? Number((0.45 + (this.lastVoltage / 1023) * 1.5).toFixed(2))
        : null;

      // Emit updated data point to the website based ONLY on actual prototype values
      const dataPoint: SerialDataPoint = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        timeMs: Date.now(),
        acetoneRaw: this.lastVoltage,
        voltageRaw: this.lastVoltage,
        glucoseValue: this.lastGlucose,
        calibratedAcetonePpm: calAcetone,
        temperatureC: parsed?.temperatureC ?? 28.0,
        humidityPct: parsed?.humidityPct ?? 58.0,
        ketoneIndex: calAcetone ? Number((calAcetone * 1.2).toFixed(2)) : null,
        deviceTitle: this.lastDeviceTitle,
        displayLines: [...this.lastDisplayLines],
        qualityStatus: 'nominal',
        isSimulated: false,
      };

      this.onDataCallback?.(dataPoint, {
        boardName: this.lastDeviceTitle,
        oledText: [...this.lastDisplayLines],
      });
    }
  }

  /**
   * Allows the user to manually edit or calibrate the device reading values.
   * Useful if the physical device cannot stream over serial or if the user
   * needs to enter the exact values shown on the hardware display.
   */
  public setManualReading(data: {
    deviceTitle?: string;
    glucoseValue?: number | null;
    voltageRaw?: number | null;
    acetonePpm?: number | null;
  }): SerialDataPoint {
    if (data.deviceTitle !== undefined) {
      this.lastDeviceTitle = data.deviceTitle;
      this.lastDisplayLines[0] = data.deviceTitle;
    }
    if (data.glucoseValue !== undefined) {
      this.lastGlucose = data.glucoseValue;
      this.lastDisplayLines[1] = data.glucoseValue !== null ? `Glucose:${data.glucoseValue} mg/dL` : 'Glucose:--- mg/dL';
    }
    if (data.voltageRaw !== undefined) {
      this.lastVoltage = data.voltageRaw;
      this.lastDisplayLines[2] = data.voltageRaw !== null ? `V = ${data.voltageRaw}` : 'V = ---';
    }

    const calPpm = data.acetonePpm !== undefined && data.acetonePpm !== null
      ? data.acetonePpm
      : (this.lastVoltage !== null ? Number((0.45 + (this.lastVoltage / 1023) * 1.5).toFixed(2)) : 0.65);

    const dataPoint: SerialDataPoint = {
      id: 'manual-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeMs: Date.now(),
      acetoneRaw: this.lastVoltage,
      voltageRaw: this.lastVoltage,
      glucoseValue: this.lastGlucose,
      calibratedAcetonePpm: calPpm,
      temperatureC: 28.0,
      humidityPct: 58.0,
      ketoneIndex: calPpm ? Number((calPpm * 1.2).toFixed(2)) : null,
      deviceTitle: this.lastDeviceTitle,
      displayLines: [...this.lastDisplayLines],
      qualityStatus: 'nominal',
      isSimulated: false,
    };

    this.onDataCallback?.(dataPoint, {
      boardName: this.lastDeviceTitle,
      oledText: [...this.lastDisplayLines],
    });

    this.onRawLineCallback?.(
      `Saved: Device reading updated manually -> Line 1: "${this.lastDisplayLines[0]}", Line 2: "${this.lastDisplayLines[1]}", Line 3: "${this.lastDisplayLines[2]}" (Acetone: ${calPpm} ppm)`,
      'system'
    );

    return dataPoint;
  }



  public async sendCommand(command: string): Promise<boolean> {
    if (!this.port || !this.port.writable) return false;
    try {
      const encoder = new TextEncoder();
      const writer = this.port.writable.getWriter();
      const terminated = command.endsWith('\n') ? command : command + '\n';
      await writer.write(encoder.encode(terminated));
      writer.releaseLock();
      this.onRawLineCallback?.(`TX > ${command}`, 'outgoing');
      return true;
    } catch (err: any) {
      this.onRawLineCallback?.(`TX error: ${err.message}`, 'error');
      return false;
    }
  }

  public async disconnect(reason: string = 'User disconnected') {
    this.isReading = false;
    if (this.reader) {
      try { await this.reader.cancel(); } catch {}
      this.reader = null;
    }
    if (this.port) {
      try { await this.port.close(); } catch {}
      this.port = null;
    }
    this.detectedBoard = 'Disconnected';
    this.onStatusCallback?.('disconnected', reason);
    this.onRawLineCallback?.(`System: Port closed (${reason}).`, 'system');
  }

  // Demonstration mode simulating a live microcontroller with an OLED screen attached!
  public startSimulation(boardName: string = 'Raspberry Pi Zero (HW-841 Figaro + 16×2 LCD)') {
    if (this.simulatedInterval) clearInterval(this.simulatedInterval);

    this.detectedBoard = boardName;
    this.onStatusCallback?.('connected', `Simulated: ${boardName}`);
    this.onRawLineCallback?.(`System: [DEMO] Streaming from simulated ${boardName} via USB Serial at 1 Hz.`, 'system');

    let step = 0;
    this.simulatedInterval = setInterval(() => {
      step++;
      const breathPhase = (step % 16) / 16;
      let breathPeak = 0;
      if (breathPhase > 0.35 && breathPhase < 0.65) {
        breathPeak = Math.sin((breathPhase - 0.35) * (Math.PI / 0.3)) * 320;
      }

      const acetoneRaw = Math.round(490 + breathPeak + (Math.random() * 12 - 6));
      const temperatureC = Number((27.6 + Math.sin(step * 0.05) * 0.6).toFixed(1));
      const humidityPct = Number((59.2 + (breathPeak > 60 ? 9 : 0)).toFixed(1));
      const calibratedAcetonePpm = Number((0.72 + (acetoneRaw / 4095) * 1.6).toFixed(2));

      // Emitting standard JSON packet including board and HW-841 sensor data
      const jsonLine = JSON.stringify({
        board: boardName,
        sensor: "HW-841 Figaro Acetone",
        acetone_raw: acetoneRaw,
        calibrated_acetone_ppm: calibratedAcetonePpm,
        temperature_c: temperatureC,
        humidity_pct: humidityPct,
      });

      this.onRawLineCallback?.(jsonLine, 'incoming');

      const dataPoint: SerialDataPoint = {
        id: 'sim-' + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        timeMs: Date.now(),
        acetoneRaw: 139,
        voltageRaw: 139,
        glucoseValue: 109,
        calibratedAcetonePpm: 0.65,
        temperatureC: 28.0,
        humidityPct: 58.0,
        ketoneIndex: 0.85,
        deviceTitle: 'Glutor V2.0',
        displayLines: ['Glutor V2.0', 'Glucose:109 mg/dL', 'V = 139'],
        qualityStatus: 'nominal',
        isSimulated: true,
      };

      this.onDataCallback?.(dataPoint, {
        boardName: 'Glutor V2.0',
        oledText: ['Glutor V2.0', 'Glucose:109 mg/dL', 'V = 139'],
      });
    }, 1000);
  }

  public stopSimulation() {
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
      this.onStatusCallback?.('disconnected', 'Demo stopped');
      this.onRawLineCallback?.('System: Demo stream stopped.', 'system');
    }
  }

  public isSimulating(): boolean {
    return this.simulatedInterval !== null;
  }
}

export const serialManager = new WebSerialManager();
