import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LiveMonitorView } from './components/LiveMonitorView';
import { MicrocontrollerHub } from './components/MicrocontrollerHub';
import { FoodLifestyle } from './components/FoodLifestyle';
import { MeasurementHistory } from './components/MeasurementHistory';
import { UserProfilePage } from './components/UserProfilePage';
import { PatientSelectorModal, DEFAULT_PATIENTS } from './components/PatientSelectorModal';
import { ThresholdConfigModal, DEFAULT_THRESHOLDS } from './components/ThresholdConfigModal';
import { EditReadingModal } from './components/EditReadingModal';
import { LoginPage } from './components/LoginPage';
import { GlutorExplainerAnimation } from './components/GlutorExplainerAnimation';

import {
  SerialDataPoint,
  ConnectionStatus,
  SerialLogEntry,
  GlucoseRecord,
  UserProfile,
  AlertThresholds,
} from './types';
import { serialManager } from './services/serialService';
import { DEMO_GLUCOSE_RECORDS, INITIAL_USER_PROFILE } from './services/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('live');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [boardName, setBoardName] = useState<string>('Microcontroller Standby');
  const [lastReceivedTimestamp, setLastReceivedTimestamp] = useState<string | null>(null);

  // Authentication & Login flow
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('glutor_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('glutor_user_email') || 'sahuarpita322@gmail.com';
    } catch {
      return 'sahuarpita322@gmail.com';
    }
  });

  // Working of Glutor Explainer Animation (triggers after login)
  const [showExplainerAnimation, setShowExplainerAnimation] = useState<boolean>(false);

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setCurrentUserEmail(email);
    try {
      localStorage.setItem('glutor_authenticated', 'true');
      localStorage.setItem('glutor_user_email', email);
    } catch {}
    // Trigger the animation explaining the working of Glutor immediately after login
    setShowExplainerAnimation(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('glutor_authenticated');
    } catch {}
  };

  // Patient Selection Flow
  const [activePatient, setActivePatient] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('acetosense_active_patient');
      return saved ? JSON.parse(saved) : DEFAULT_PATIENTS[0];
    } catch {
      return DEFAULT_PATIENTS[0];
    }
  });

  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);

  // Live telemetry data stream
  const [currentData, setCurrentData] = useState<SerialDataPoint | null>(null);
  const [historyData, setHistoryData] = useState<SerialDataPoint[]>([]);
  const [logs, setLogs] = useState<SerialLogEntry[]>([]);

  // Persistent health records
  const [glucoseRecords, setGlucoseRecords] = useState<GlucoseRecord[]>(() => {
    try {
      const saved = localStorage.getItem('acetosense_glucose_records');
      return saved ? JSON.parse(saved) : DEMO_GLUCOSE_RECORDS;
    } catch {
      return DEMO_GLUCOSE_RECORDS;
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('acetosense_glucose_records', JSON.stringify(glucoseRecords));
    } catch {}
  }, [glucoseRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('acetosense_active_patient', JSON.stringify(activePatient));
    } catch {}
  }, [activePatient]);

  // Configure WebSerialManager callbacks
  useEffect(() => {
    serialManager.setCallbacks(
      (dataPoint: SerialDataPoint, meta?: { boardName?: string }) => {
        setCurrentData(dataPoint);
        setLastReceivedTimestamp(dataPoint.timestamp);
        if (meta?.boardName) {
          setBoardName(meta.boardName);
        }
        setHistoryData((prev) => {
          const next = [...prev, dataPoint];
          return next.length > 200 ? next.slice(-200) : next;
        });
      },
      (line: string, type: 'incoming' | 'outgoing' | 'system' | 'error') => {
        const entry: SerialLogEntry = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toISOString(),
          type,
          text: line,
        };
        setLogs((prev) => {
          const next = [...prev, entry];
          return next.length > 200 ? next.slice(-200) : next;
        });
      },
      (status: ConnectionStatus, msg?: string) => {
        setConnectionStatus(status);
        if (msg) setStatusMessage(msg);
        if (status === 'disconnected') {
          setIsSimulated(false);
          setBoardName('Disconnected');
        }
      }
    );

    // Ready in standby mode waiting for physical USB connection
    setIsSimulated(false);
    setBoardName('Device Standby');
  }, []);

  // Alert Thresholds configuration state
  const [thresholds, setThresholds] = useState<AlertThresholds>(() => {
    try {
      const saved = localStorage.getItem('glutor_threshold_config');
      return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
    } catch {
      return DEFAULT_THRESHOLDS;
    }
  });

  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSaveThresholds = (newThresholds: AlertThresholds) => {
    setThresholds(newThresholds);
    try {
      localStorage.setItem('glutor_threshold_config', JSON.stringify(newThresholds));
    } catch {}
  };

  const handleSaveManualReading = (data: {
    deviceTitle: string;
    glucoseValue: number;
    voltageRaw: number;
    acetonePpm: number;
  }) => {
    const updatedPoint = serialManager.setManualReading({
      deviceTitle: data.deviceTitle,
      glucoseValue: data.glucoseValue,
      voltageRaw: data.voltageRaw,
      acetonePpm: data.acetonePpm,
    });
    setCurrentData(updatedPoint);
    setHistoryData((prev) => [...prev, updatedPoint]);

    // Also record in health history
    const newRecord: GlucoseRecord = {
      id: 'rec-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      source: 'raw_sensor',
      value: data.glucoseValue,
      unit: 'mg/dL',
      context: activePatient.defaultMeasurementContext || 'fasting',
      notes: `[GLUTOR.V2 Live Output] ${data.deviceTitle} | Glucose: ${data.glucoseValue} mg/dL | V: ${data.voltageRaw} (Acetone: ${data.acetonePpm} ppm)`,
      correlatedAcetoneRaw: data.voltageRaw,
      calibratedAcetonePpm: data.acetonePpm,
      isSimulated: false,
    };
    setGlucoseRecords((prev) => [newRecord, ...prev]);
  };

  // 1-Port USB Connect handler: opens USB port selection for prototype without hardcoded defaults
  const handleConnect = async () => {
    serialManager.setBaudRate(baudRate);
    const success = await serialManager.connect();
    if (success) {
      setIsSimulated(false);
      setBoardName('Prototype Connected (1 USB Port)');
    }
  };

  // Disconnect handler
  const handleDisconnect = () => {
    if (isSimulated) {
      serialManager.stopSimulation();
      setIsSimulated(false);
    } else {
      serialManager.disconnect('User disconnected');
    }
    setBoardName('Prototype Standby');
  };

  // Toggle demo simulation mode
  const handleToggleSimulation = (enable: boolean) => {
    if (enable) {
      serialManager.startSimulation('Hardware Sensor Simulator');
      setIsSimulated(true);
      setBoardName('Hardware Sensor Simulator');
    } else {
      serialManager.stopSimulation();
      setIsSimulated(false);
      setBoardName('Prototype Standby');
    }
  };

  // Patient select callback
  const handleSelectPatient = (patient: UserProfile) => {
    setActivePatient(patient);
    try {
      localStorage.setItem('acetosense_patient_selected_flag', 'true');
    } catch {}
  };

  // Modal for logging certified blood glucose
  const [showAddGlucoseModal, setShowAddGlucoseModal] = useState(false);
  const [glucoseInputVal, setGlucoseInputVal] = useState<string>('102');
  const [glucoseUnit, setGlucoseUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [glucoseContext, setGlucoseContext] = useState<any>('fasting');
  const [glucoseNotes, setGlucoseNotes] = useState('');

  const handleSaveGlucose = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(glucoseInputVal);
    if (isNaN(val) || val <= 0) return;

    const newRecord: GlucoseRecord = {
      id: 'rec-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      source: 'independent_meter',
      value: val,
      unit: glucoseUnit,
      context: glucoseContext,
      notes: glucoseNotes.trim() ? `[Patient: ${activePatient.fullName}] ${glucoseNotes.trim()}` : `Patient: ${activePatient.fullName}`,
      correlatedAcetoneRaw: currentData?.acetoneRaw ?? null,
      calibratedAcetonePpm: currentData?.calibratedAcetonePpm ?? null,
      isSimulated,
    };

    setGlucoseRecords((prev) => [newRecord, ...prev]);
    setShowAddGlucoseModal(false);
    setGlucoseNotes('');
  };

  // Export Sensor Telemetry to CSV
  const handleExportSensorCsv = () => {
    if (historyData.length === 0) return;

    const headers = [
      'Patient_Name',
      'Timestamp_ISO',
      'Epoch_MS',
      'Acetone_Raw_ADC',
      'Calibrated_Acetone_PPM',
      'Temperature_C',
      'Humidity_Pct',
      'Quality_Status',
      'Is_Simulated',
    ];

    const rows = historyData.map((d) => [
      activePatient.fullName,
      d.timestamp,
      d.timeMs,
      d.acetoneRaw ?? '',
      d.calibratedAcetonePpm ?? '',
      d.temperatureC ?? '',
      d.humidityPct ?? '',
      d.qualityStatus,
      d.isSimulated ? 'TRUE' : 'FALSE',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GLUTOR_V2_${activePatient.fullName.replace(/\s+/g, '_')}_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Glucose Records to CSV
  const handleExportGlucoseCsv = () => {
    if (glucoseRecords.length === 0) return;

    const headers = [
      'Record_ID',
      'Timestamp_ISO',
      'Source',
      'Glucose_Value',
      'Unit',
      'Context',
      'Notes',
      'Correlated_Acetone_Raw',
      'Is_Simulated',
    ];

    const rows = glucoseRecords.map((r) => [
      r.id,
      r.timestamp,
      r.source,
      r.value,
      r.unit,
      r.context,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      r.correlatedAcetoneRaw ?? '',
      r.isSimulated ? 'TRUE' : 'FALSE',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GLUTOR_V2_Glucose_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const latestGlucoseRecord = glucoseRecords
    .filter((r) => r.source === 'independent_meter' || r.source === 'manual_entry')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] || null;

  // If not authenticated, present the login page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Working of Glutor Explainer Animation (Shown after login or on demand) */}
      {showExplainerAnimation && (
        <GlutorExplainerAnimation
          onComplete={() => setShowExplainerAnimation(false)}
          onSkip={() => setShowExplainerAnimation(false)}
        />
      )}

      {/* Patient Selection Modal */}
      <PatientSelectorModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSelectPatient={handleSelectPatient}
        activePatient={activePatient}
      />

      {/* Alert Thresholds Configuration Modal */}
      <ThresholdConfigModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        thresholds={thresholds}
        onSaveThresholds={handleSaveThresholds}
      />

      {/* Sync from Device Modal */}
      <EditReadingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={currentData}
        onSaveReading={handleSaveManualReading}
      />

      {/* Top Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        connectionStatus={connectionStatus}
        isSimulated={isSimulated}
        onQuickConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onOpenAnimation={() => setShowExplainerAnimation(true)}
        onLogout={handleLogout}
        userEmail={currentUserEmail}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Live Monitor (Hardware Screen Mirror) */}
        {currentTab === 'live' && (
          <LiveMonitorView
            currentData={currentData}
            historyData={historyData}
            connectionStatus={connectionStatus}
            statusMessage={statusMessage}
            boardName={boardName}
            isSimulated={isSimulated}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onToggleSimulation={handleToggleSimulation}
            onExportCsv={handleExportSensorCsv}
            onAddGlucose={() => setShowAddGlucoseModal(true)}
            latestGlucoseRecord={latestGlucoseRecord}
            activePatient={activePatient}
            onOpenPatientModal={() => setIsPatientModalOpen(true)}
            thresholds={thresholds}
            onOpenThresholdModal={() => setIsThresholdModalOpen(true)}
            onOpenEditModal={() => setIsEditModalOpen(true)}
            onOpenAnimation={() => setShowExplainerAnimation(true)}
          />
        )}

        {/* Tab 2: Universal Microcontroller Hub */}
        {currentTab === 'mcu' && (
          <MicrocontrollerHub
            selectedBoard={boardName}
            onQuickConnect={handleConnect}
          />
        )}

        {/* Tab 3: Food & Health */}
        {currentTab === 'lifestyle' && (
          <FoodLifestyle userProfile={activePatient} />
        )}

        {/* Tab 4: History & CSV */}
        {currentTab === 'history' && (
          <MeasurementHistory
            records={glucoseRecords}
            onDeleteRecord={(id) => setGlucoseRecords((prev) => prev.filter((r) => r.id !== id))}
            onClearAll={() => setGlucoseRecords([])}
            onUpdateNotes={(id, notes) =>
              setGlucoseRecords((prev) =>
                prev.map((r) => (r.id === id ? { ...r, notes } : r))
              )
            }
            onExportCsv={handleExportGlucoseCsv}
          />
        )}

        {/* Tab 5: User Health Profile */}
        {currentTab === 'profile' && (
          <UserProfilePage
            profile={activePatient}
            onSaveProfile={(updated) => {
              setActivePatient(updated);
            }}
            onResetData={() => {
              setGlucoseRecords([]);
              setActivePatient(DEFAULT_PATIENTS[0]);
              setHistoryData([]);
              try {
                localStorage.clear();
              } catch {}
            }}
          />
        )}

      </main>

      {/* Modal: Log Independent Certified Blood Glucose */}
      {showAddGlucoseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f19] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Certified Blood Glucose</h3>
              <button
                onClick={() => setShowAddGlucoseModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGlucose} className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] text-cyan-400 font-mono block mb-1">
                  PATIENT: {activePatient.fullName}
                </span>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Meter Glucose Reading
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={glucoseInputVal}
                    onChange={(e) => setGlucoseInputVal(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 102"
                  />
                  <select
                    value={glucoseUnit}
                    onChange={(e) => setGlucoseUnit(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-400"
                  >
                    <option value="mg/dL">mg/dL</option>
                    <option value="mmol/L">mmol/L</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Measurement Context
                </label>
                <select
                  value={glucoseContext}
                  onChange={(e) => setGlucoseContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="fasting">Morning Fasting</option>
                  <option value="before_meal">Pre-Meal (Preprandial)</option>
                  <option value="2h_post_meal">2 Hours After Meal</option>
                  <option value="bedtime">Bedtime</option>
                  <option value="random">Random Daytime</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={glucoseNotes}
                  onChange={(e) => setGlucoseNotes(e.target.value)}
                  placeholder="e.g. Accu-Chek check before breakfast"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGlucoseModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#05070c] text-xs text-slate-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-white">GLUTOR.V2</span>
            <span>·</span>
            <span>Direct Hardware Telemetry &amp; Health Insights</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Baud: 115200</span>
            <span>·</span>
            <span>Client-Side Web Serial (1 USB Port)</span>
            <span>·</span>
            <span>Patient: {activePatient.fullName.split(' ')[0]}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
