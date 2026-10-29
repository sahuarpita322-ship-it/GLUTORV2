import React, { useState, useRef, useEffect } from 'react';
import {
  Usb,
  Cpu,
  Terminal,
  Play,
  Square,
  RefreshCw,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Radio,
  Send,
  Trash2,
  Settings,
  Code
} from 'lucide-react';
import { ConnectionStatus, SerialLogEntry } from '../types';
import { SerialDataParser } from '../services/serialService';
import { ESP32_ARDUINO_SKETCH, downloadSketchFile } from '../services/firmwareHelper';

interface DeviceConnectionProps {
  connectionStatus: ConnectionStatus;
  statusMessage?: string;
  baudRate: number;
  onBaudRateChange: (rate: number) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  logs: SerialLogEntry[];
  onClearLogs: () => void;
  onSendCommand: (cmd: string) => void;
  isSimulated: boolean;
  onToggleSimulation: (enable: boolean) => void;
  lastReceivedTimestamp: string | null;
}

export const DeviceConnection: React.FC<DeviceConnectionProps> = ({
  connectionStatus,
  statusMessage,
  baudRate,
  onBaudRateChange,
  onConnect,
  onDisconnect,
  logs,
  onClearLogs,
  onSendCommand,
  isSimulated,
  onToggleSimulation,
  lastReceivedTimestamp,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'parser_test' | 'firmware'>('terminal');

  // Parser test sandbox
  const [testString, setTestString] = useState(
    '{"acetone_raw":512,"temperature_c":28.5,"humidity_pct":62.0}'
  );
  const [testResult, setTestResult] = useState<any>(null);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleTestParse = () => {
    const res = SerialDataParser.parseLine(testString);
    setTestResult(res);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    onSendCommand(commandInput.trim());
    setCommandInput('');
  };

  const copyFirmwareToClipboard = () => {
    navigator.clipboard.writeText(ESP32_ARDUINO_SKETCH);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isWebSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Hardware Bridge
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">Web Serial CDC Port</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>ESP32 USB Serial Connection</span>
            {isSimulated && (
              <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                SIMULATED DATA ACTIVE
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Streams raw 12-bit ADC acetone measurements and environmental telemetry directly from your microcontroller over USB at 115200 baud.
          </p>
        </div>

        {/* Quick Connection Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {connectionStatus === 'connected' ? (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Usb className="w-4 h-4 text-slate-950" />
              <span>Connect ESP32</span>
            </button>
          )}

          {/* Demonstration Mode Switch */}
          <button
            onClick={() => onToggleSimulation(!isSimulated)}
            className={`px-3 py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
              isSimulated
                ? 'bg-amber-950/40 border-amber-600/60 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle simulated ESP32 serial data for demonstration without physical hardware"
          >
            {isSimulated ? 'Exit Demo Mode' : 'Run Demo Stream'}
          </button>
        </div>
      </div>

      {/* Web Serial Support Advisory */}
      {!isWebSerialSupported && (
        <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Web Serial API Not Detected in Current Browser</span>
            <span>
              The browser does not expose <code className="bg-amber-900/40 px-1 py-0.5 rounded font-mono">navigator.serial</code>. Direct USB connectivity requires Google Chrome, Microsoft Edge, Opera, or Chromium on desktop (Windows, macOS, Linux, or ChromeOS). Alternatively, toggle the <strong className="text-white">Run Demo Stream</strong> button to evaluate the full dashboard.
            </span>
          </div>
        </div>
      )}

      {/* Connection Parameter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Status Box */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Port Status</span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-cyan-400 animate-pulse' :
              connectionStatus === 'connecting' ? 'bg-amber-400 animate-ping' :
              connectionStatus === 'error' ? 'bg-rose-500' : 'bg-slate-600'
            }`} />
            <span className="font-mono text-sm font-semibold uppercase text-white">
              {connectionStatus.replace('_', ' ')}
            </span>
          </div>
          {statusMessage && (
            <p className="text-[11px] text-slate-400 mt-1 truncate" title={statusMessage}>
              {statusMessage}
            </p>
          )}
        </div>

        {/* Baud Rate Selector */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">UART Baud Rate</span>
          <select
            disabled={connectionStatus === 'connected'}
            value={baudRate}
            onChange={(e) => onBaudRateChange(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          >
            <option value={9600}>9600 bps</option>
            <option value={57600}>57600 bps</option>
            <option value={115200}>115200 bps (Recommended)</option>
            <option value={230400}>230400 bps</option>
            <option value={921600}>921600 bps</option>
          </select>
        </div>

        {/* Protocol Format */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Stream Protocol</span>
          <div className="text-xs font-mono text-teal-300">
            JSON / Key-Value Auto
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Delimiter: \n (newline-buffered)
          </span>
        </div>

        {/* Last Packet Timestamp */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Last Telemetry RX</span>
          <div className="font-mono text-xs text-slate-200 tabular-nums">
            {lastReceivedTimestamp ? new Date(lastReceivedTimestamp).toLocaleTimeString() : 'No data yet'}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Lines logged: {logs.length}
          </span>
        </div>
      </div>

      {/* Tabs: Terminal Monitor vs Parser Test vs Arduino Firmware */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw Serial Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab('parser_test')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'parser_test'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Packet Parser Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('firmware')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'firmware'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>ESP32 Arduino Firmware (.ino)</span>
            </button>
          </div>

          {activeTab === 'terminal' && (
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-400 flex items-center gap-1.5 cursor-pointer font-mono select-none">
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <span>Auto-scroll</span>
              </label>

              <button
                onClick={onClearLogs}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                title="Clear console output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Raw Terminal Monitor */}
        {activeTab === 'terminal' && (
          <div className="bg-[#05070c] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 text-slate-300 font-semibold">ESP32 CDC Terminal — /dev/ttyUSB0</span>
              </div>
              <span>Stream: ASCII UTF-8</span>
            </div>

            {/* Terminal Output Window */}
            <div className="h-80 overflow-y-auto p-4 font-mono text-xs space-y-1 select-text">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                  <Terminal className="w-8 h-8 mb-2 opacity-40" />
                  <span>No serial telemetry received yet.</span>
                  <span className="mt-1 text-[11px]">Click "Connect ESP32" or "Run Demo Stream" to begin streaming.</span>
                </div>
              ) : (
                logs.map((log) => {
                  let colorClass = 'text-slate-300';
                  let prefix = '←';
                  if (log.type === 'outgoing') {
                    colorClass = 'text-cyan-400';
                    prefix = '→';
                  } else if (log.type === 'system') {
                    colorClass = 'text-amber-300';
                    prefix = 'ℹ';
                  } else if (log.type === 'error') {
                    colorClass = 'text-rose-400 font-semibold';
                    prefix = '✖';
                  }

                  return (
                    <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-slate-900/40 px-1 py-0.5 rounded">
                      <span className="text-[10px] text-slate-600 tabular-nums select-none shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-slate-500 select-none shrink-0">{prefix}</span>
                      <span className={`${colorClass} break-all whitespace-pre-wrap`}>
                        {log.text}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Bar */}
            <form onSubmit={handleSend} className="bg-slate-950 p-2.5 border-t border-slate-800 flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 pl-2">TX &gt;</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter command (e.g., PING, CALIB, RATE=1000) and press Enter..."
                className="flex-1 bg-transparent text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-mono rounded transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Packet Parser Sandbox */}
        {activeTab === 'parser_test' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Stream Parser Diagnostic Sandbox</h3>
              <p className="text-xs text-slate-400">
                Test how AcetoSense parses incoming strings from your ESP32. Supports both JSON and Key-Value representations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setTestString('{"acetone_raw":512,"temperature_c":28.5,"humidity_pct":62.0}')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px]"
              >
                Preset 1: Standard JSON
              </button>
              <button
                onClick={() => setTestString('AcetoneRaw:512,Temperature:28.5,Humidity:62.0')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px]"
              >
                Preset 2: Key-Value Format
              </button>
              <button
                onClick={() => setTestString('{"acetone":740,"temp":29.1}')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[11px]"
              >
                Preset 3: Partial Packet (Missing Humidity)
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200"
              />
              <button
                onClick={handleTestParse}
                className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold rounded"
              >
                Parse String
              </button>
            </div>

            {testResult && (
              <div className="bg-[#05070c] border border-slate-800 rounded-lg p-4 font-mono text-xs">
                <span className="text-[10px] uppercase text-cyan-400 block mb-2 font-bold">Parser Extraction Output:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Acetone Raw (ADC):</span>
                    <span className="font-bold text-white text-sm">{testResult.acetoneRaw ?? 'Not Available'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Temperature (°C):</span>
                    <span className="font-bold text-white text-sm">{testResult.temperatureC ?? 'Not Available'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Humidity (%):</span>
                    <span className="font-bold text-white text-sm">{testResult.humidityPct ?? 'Not Available'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Quality Flag:</span>
                    <span className="font-bold text-cyan-400 uppercase text-xs">{testResult.qualityStatus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: ESP32 Arduino Firmware (.ino) */}
        {activeTab === 'firmware' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">AcetoSense ESP32 Firmware Source</h3>
                <p className="text-xs text-slate-400">
                  Ready-to-flash C++ sketch for Arduino IDE with hardware averaging, baseline storage, and JSON emission.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyFirmwareToClipboard}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={downloadSketchFile}
                  className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download AcetoSense_ESP32.ino</span>
                </button>
              </div>
            </div>

            {/* Wiring Diagram Quick Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <span className="text-xs font-mono font-semibold text-cyan-400 block mb-2 uppercase">Hardware Pinout Connections</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white block">MQ-138 Gas Sensor</span>
                  <span className="text-slate-400 font-mono text-[11px]">Analog Out (AO) → GPIO 36 (VP)</span>
                  <span className="text-slate-500 font-mono text-[10px] block mt-0.5">VCC → 5V · GND → ESP32 GND</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white block">DHT22 / BME280 Sensor</span>
                  <span className="text-slate-400 font-mono text-[11px]">Data Pin → GPIO 4 (10k pull-up)</span>
                  <span className="text-slate-500 font-mono text-[10px] block mt-0.5">VCC → 3.3V · GND → ESP32 GND</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="font-bold text-white block">USB-C / Micro-USB Link</span>
                  <span className="text-slate-400 font-mono text-[11px]">115200 Baud CDC Serial</span>
                  <span className="text-slate-500 font-mono text-[10px] block mt-0.5">Direct to PC Web Browser</span>
                </div>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="bg-[#05070c] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
                <code>{ESP32_ARDUINO_SKETCH}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
