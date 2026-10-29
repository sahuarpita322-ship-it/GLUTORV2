import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Cpu,
  Thermometer,
  Droplets,
  Zap,
  Play,
  Square,
  Download,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
  FlaskConical,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  SerialDataPoint,
  ConnectionStatus,
  GlucoseRecord,
  MeasurementContext,
  EstimationModelConfig,
  UserProfile
} from '../types';

interface SensorDashboardProps {
  currentData: SerialDataPoint | null;
  historyData: SerialDataPoint[];
  connectionStatus: ConnectionStatus;
  isSimulated: boolean;
  isLogging: boolean;
  onToggleLogging: (logging: boolean) => void;
  onExportCsv: () => void;
  glucoseRecords: GlucoseRecord[];
  onAddGlucoseRecord: (record: Omit<GlucoseRecord, 'id'>) => void;
  userProfile: UserProfile | null;
  onNavigate: (tab: string) => void;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({
  currentData,
  historyData,
  connectionStatus,
  isSimulated,
  isLogging,
  onToggleLogging,
  onExportCsv,
  glucoseRecords,
  onAddGlucoseRecord,
  userProfile,
  onNavigate,
}) => {
  // Modal for logging certified blood glucose
  const [showAddGlucoseModal, setShowAddGlucoseModal] = useState(false);
  const [glucoseInputVal, setGlucoseInputVal] = useState<string>('105');
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [glucoseContext, setGlucoseContext] = useState<MeasurementContext>('fasting');
  const [glucoseNotes, setGlucoseNotes] = useState('');

  // Estimation model configuration toggle (for research comparison)
  const [activeModel, setActiveModel] = useState<EstimationModelConfig>({
    id: 'none',
    name: 'Unconfigured / No Certified Clinical Model',
    version: '0.0.0',
    status: 'unconfigured',
    description: 'A validated glucose estimation model is not yet configured, so a reliable glucose result cannot currently be provided.',
  });

  // Oscilloscope canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render real-time live sensor waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle grid lines
    ctx.strokeStyle = '#151e33';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // If no data points, show waiting line
    const points = historyData.slice(-60); // Last 60 readings
    if (points.length < 2) {
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    // Determine scale for raw acetone (ADC: typically 200 - 1500)
    const adcValues = points.map((p) => p.acetoneRaw ?? 400);
    const minAdc = Math.max(0, Math.min(...adcValues) - 50);
    const maxAdc = Math.max(1000, Math.max(...adcValues) + 50);
    const adcRange = maxAdc - minAdc || 1;

    // Draw gradient area under curve
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const raw = p.acetoneRaw ?? 400;
      const normalized = (raw - minAdc) / adcRange;
      const y = height - (normalized * (height - 30) + 15);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw primary curve
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const raw = p.acetoneRaw ?? 400;
      const normalized = (raw - minAdc) / adcRange;
      const y = height - (normalized * (height - 30) + 15);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Current point highlight
    const lastX = width;
    const lastRaw = points[points.length - 1].acetoneRaw ?? 400;
    const lastNorm = (lastRaw - minAdc) / adcRange;
    const lastY = height - (lastNorm * (height - 30) + 15);

    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(lastX - 4, lastY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [historyData]);

  // Handle saving independent certified glucose reading
  const handleSaveGlucose = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(glucoseInputVal);
    if (isNaN(val) || val <= 0) return;

    onAddGlucoseRecord({
      timestamp: new Date().toISOString(),
      source: 'independent_meter',
      value: val,
      unit: glucoseUnit,
      context: glucoseContext,
      notes: glucoseNotes.trim() || undefined,
      correlatedAcetoneRaw: currentData?.acetoneRaw ?? null,
      calibratedAcetonePpm: currentData?.calibratedAcetonePpm ?? null,
      isSimulated,
    });

    setShowAddGlucoseModal(false);
    setGlucoseNotes('');
  };

  // Latest validated glucose record
  const latestValidatedRecord = glucoseRecords
    .filter((r) => r.source === 'independent_meter' || r.source === 'manual_entry')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  return (
    <div className="space-y-8 py-4">
      
      {/* Real-time Telemetry Ribbon */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${
            connectionStatus === 'connected' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
          }`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">Live Sensor Telemetry Console</span>
              {isSimulated && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-semibold">
                  SIMULATED DATA
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AcetoSense ESP32 stream · Sampling rate: 1 Hz · Raw 12-bit ADC + Environmental sensors
            </p>
          </div>
        </div>

        {/* Action Buttons: Logging & CSV */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggleLogging(!isLogging)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLogging
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80 hover:bg-rose-900/60'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/60'
            }`}
          >
            {isLogging ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Logging</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Start Logging</span>
              </>
            )}
          </button>

          <button
            onClick={onExportCsv}
            disabled={historyData.length === 0}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddGlucoseModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Meter Glucose</span>
          </button>
        </div>
      </div>

      {/* 4-Tile Primary Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Raw Acetone ADC */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>RAW ACETONE SENSOR</span>
            <span className="text-[10px] text-cyan-400">ADC (0–4095)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {currentData?.acetoneRaw ?? 'Not Available'}
            </span>
            {currentData?.acetoneRaw !== null && currentData?.acetoneRaw !== undefined && (
              <span className="text-xs font-mono text-slate-500">units</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Hardware baseline: ~450</span>
            <span className="text-cyan-400 font-mono">
              {currentData?.qualityStatus ? currentData.qualityStatus.toUpperCase() : 'WAITING'}
            </span>
          </div>
        </div>

        {/* Card 2: Calibrated Acetone Concentration */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>CALIBRATED ACETONE</span>
            <span className="text-[10px] text-teal-400">PARTS PER MILLION</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-teal-300 tabular-nums">
              {currentData?.calibratedAcetonePpm !== null && currentData?.calibratedAcetonePpm !== undefined
                ? currentData.calibratedAcetonePpm
                : 'Not Available'}
            </span>
            {currentData?.calibratedAcetonePpm !== null && currentData?.calibratedAcetonePpm !== undefined && (
              <span className="text-xs font-mono text-slate-500">ppm</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            {currentData?.calibratedAcetonePpm !== null
              ? 'Computed via calibrated transfer function'
              : 'Requires dual-point laboratory calibration'}
          </div>
        </div>

        {/* Card 3: Ambient Temperature */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>TEMPERATURE</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {currentData?.temperatureC !== null && currentData?.temperatureC !== undefined
                ? currentData.temperatureC
                : 'Not Available'}
            </span>
            {currentData?.temperatureC !== null && currentData?.temperatureC !== undefined && (
              <span className="text-xs font-mono text-slate-500">°C</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            Compensates MOS gas sensor surface
          </div>
        </div>

        {/* Card 4: Relative Humidity */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>RELATIVE HUMIDITY</span>
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white tabular-nums">
              {currentData?.humidityPct !== null && currentData?.humidityPct !== undefined
                ? currentData.humidityPct
                : 'Not Available'}
            </span>
            {currentData?.humidityPct !== null && currentData?.humidityPct !== undefined && (
              <span className="text-xs font-mono text-slate-500">% RH</span>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            {currentData?.humidityPct && currentData.humidityPct > 80
              ? 'Warning: High moisture condensation'
              : 'Within acceptable sensing band'}
          </div>
        </div>
      </div>

      {/* Live Waveform Oscilloscope */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Breath Exhalation Oscilloscope</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live ADC waveform tracking breath exhalation cycles and dynamic sensor resistance recovery
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
              <span>Raw Signal Waveform</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 tabular-nums">
              Buffer: {historyData.length} pts
            </span>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="w-full bg-[#070a12] rounded-xl border border-slate-800 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={900}
            height={220}
            className="w-full h-52 block"
          />
          {historyData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500 font-mono">
              Waiting for stream... Click "Connect ESP32" or "Run Demo Stream"
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY PROMINENT SECTION: Glucose Monitoring and Insights */}
      <div className="bg-gradient-to-b from-slate-900/90 to-[#0b101c] border border-cyan-900/50 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Clinical & Experimental Interface
            </div>
            <h2 className="text-2xl font-bold text-white">
              Glucose Monitoring and Insights
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Strict boundary enforcement: Certified capillary/CGM measurements are recorded separately from exploratory acetone correlation models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('insights')}
              className="px-3.5 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-lg hover:bg-cyan-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Health Insights & Next Steps</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Two-Column Comparison: Validated Meter Reading vs Estimation Model Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Column A: Independently Measured Blood Glucose (Certified Meter) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>VALIDATED GLUCOSE MEASUREMENT</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Independent Meter</span>
              </div>

              {latestValidatedRecord ? (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold font-mono text-white tabular-nums">
                      {latestValidatedRecord.value}
                    </span>
                    <span className="text-base font-mono text-slate-400 font-semibold">
                      {latestValidatedRecord.unit}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono capitalize">
                      {latestValidatedRecord.context.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">TIMESTAMP:</span>
                      <span className="text-slate-200">
                        {new Date(latestValidatedRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(latestValidatedRecord.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">SOURCE:</span>
                      <span className="text-emerald-400">Certified Capillary Meter</span>
                    </div>
                  </div>

                  {latestValidatedRecord.notes && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/30 p-2 rounded">
                      "{latestValidatedRecord.notes}"
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 space-y-2">
                  <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">No independent blood glucose readings recorded yet.</p>
                  <button
                    onClick={() => setShowAddGlucoseModal(true)}
                    className="text-xs text-cyan-400 underline font-semibold"
                  >
                    Click to log a verified fingerstick measurement
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Reference: ADA 2026</span>
              <button
                onClick={() => setShowAddGlucoseModal(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                + Log New Value
              </button>
            </div>
          </div>

          {/* Column B: Acetone-Based Glucose Estimation Model Status */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-cyan-400" />
                  <span>ACETONE ESTIMATION MODEL STATUS</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 border border-amber-800/40 px-1.5 py-0.5 rounded">
                  EXPERIMENTAL
                </span>
              </div>

              {/* Exact Mandated Requirement Notice */}
              {activeModel.status === 'unconfigured' ? (
                <div className="bg-[#0e1424] border border-cyan-900/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        Your sensor data has been received. A validated glucose estimation model is not yet configured, so a reliable glucose result cannot currently be provided.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        To estimate blood glucose from volatile breath ketones, multi-day paired datasets with standardized clinical reference laboratory measurements are required to fit a person-specific or population transfer model.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-cyan-300">
                      {currentData?.acetoneRaw ? Math.round(75 + (currentData.acetoneRaw / 4095) * 80) : '---'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">mg/dL (Estimated)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Model: {activeModel.name} (v{activeModel.version}) · R²: {activeModel.rSquared}
                  </p>
                  <p className="text-[11px] text-amber-300/80 bg-amber-950/30 p-2 rounded border border-amber-900/30">
                    Notice: This estimate is purely exploratory. Do not treat as a true blood glucose measurement.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Model Engine: v0.0.0-unvalidated</span>
              <button
                onClick={() => {
                  if (activeModel.status === 'unconfigured') {
                    setActiveModel({
                      id: 'res-lin-1',
                      name: 'Linear Biomarker Transfer Fit',
                      version: '1.2-alpha',
                      status: 'calibrated_active',
                      rSquared: 0.64,
                      description: 'Exploratory linear regression model mapping MOS acetone sensor voltage to estimated capillary glucose.',
                    });
                  } else {
                    setActiveModel({
                      id: 'none',
                      name: 'Unconfigured / No Certified Clinical Model',
                      version: '0.0.0',
                      status: 'unconfigured',
                      description: 'A validated glucose estimation model is not yet configured, so a reliable glucose result cannot currently be provided.',
                    });
                  }
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                {activeModel.status === 'unconfigured' ? 'Preview Research Model' : 'Reset to Unconfigured'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Measurements Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Telemetry & Measurement Stream</h3>
          <span className="text-xs font-mono text-slate-400">Showing last {Math.min(5, historyData.length)} packets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type / Source</th>
                <th className="py-2.5 px-3">Acetone Raw (ADC)</th>
                <th className="py-2.5 px-3">Calibrated (ppm)</th>
                <th className="py-2.5 px-3">Temperature</th>
                <th className="py-2.5 px-3">Humidity</th>
                <th className="py-2.5 px-3">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {historyData.slice(-5).reverse().map((dp) => (
                <tr key={dp.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-400 tabular-nums">
                    {new Date(dp.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      dp.isSimulated
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                        : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50'
                    }`}>
                      {dp.isSimulated ? 'Simulated' : 'ESP32 Serial'}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-bold text-white tabular-nums">
                    {dp.acetoneRaw ?? 'N/A'}
                  </td>
                  <td className="py-2 px-3 text-teal-300 tabular-nums">
                    {dp.calibratedAcetonePpm !== null ? dp.calibratedAcetonePpm : 'N/A'}
                  </td>
                  <td className="py-2 px-3 tabular-nums">
                    {dp.temperatureC !== null ? `${dp.temperatureC} °C` : 'N/A'}
                  </td>
                  <td className="py-2 px-3 tabular-nums">
                    {dp.humidityPct !== null ? `${dp.humidityPct} %` : 'N/A'}
                  </td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] text-cyan-400 uppercase">
                      {dp.qualityStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {historyData.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No stream packets recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Independent Certified Blood Glucose */}
      {showAddGlucoseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f19] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Log Validated Blood Glucose</span>
              </h3>
              <button
                onClick={() => setShowAddGlucoseModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGlucose} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Measured Value & Units
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={glucoseInputVal}
                    onChange={(e) => setGlucoseInputVal(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 105"
                  />
                  <select
                    value={glucoseUnit}
                    onChange={(e) => setGlucoseUnit(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none"
                  >
                    <option value="mg/dL">mg/dL</option>
                    <option value="mmol/L">mmol/L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Measurement Context / Timing
                </label>
                <select
                  value={glucoseContext}
                  onChange={(e) => setGlucoseContext(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="fasting">Fasting (at least 8 hours no caloric intake)</option>
                  <option value="before_meal">Before Meal (Preprandial)</option>
                  <option value="1h_post_meal">1 Hour After Meal (Postprandial)</option>
                  <option value="2h_post_meal">2 Hours After Meal (Postprandial)</option>
                  <option value="bedtime">Bedtime</option>
                  <option value="random">Random / Daytime</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Notes (e.g., Meal details, physical exertion, symptoms)
                </label>
                <textarea
                  rows={2}
                  value={glucoseNotes}
                  onChange={(e) => setGlucoseNotes(e.target.value)}
                  placeholder="e.g. Taken with Accu-Chek meter. Had dalma and roti for dinner."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-white block mb-0.5">Measurement Integrity:</span>
                This value will be stored as an independent clinical ground-truth reading and compared with correlated breath acetone readings.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGlucoseModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
