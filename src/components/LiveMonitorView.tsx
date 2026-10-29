import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Usb,
  Cpu,
  Tv,
  Zap,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Download,
  Square,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
  Apple,
  Utensils,
  Footprints,
  HeartPulse,
  Sparkles,
  Info,
  Check,
  Ban,
  Edit3,
  Sliders,
  Flame,
  Bell
} from 'lucide-react';
import { SerialDataPoint, ConnectionStatus, GlucoseRecord, UserProfile, AlertThresholds } from '../types';

interface LiveMonitorViewProps {
  currentData: SerialDataPoint | null;
  historyData: SerialDataPoint[];
  connectionStatus: ConnectionStatus;
  statusMessage?: string;
  boardName: string;
  isSimulated: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleSimulation: (enable: boolean) => void;
  onExportCsv: () => void;
  onAddGlucose: () => void;
  latestGlucoseRecord: GlucoseRecord | null;
  activePatient: UserProfile | null;
  onOpenPatientModal: () => void;
  thresholds: AlertThresholds;
  onOpenThresholdModal: () => void;
  onOpenEditModal: () => void;
  onOpenAnimation?: () => void;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({
  currentData,
  historyData,
  connectionStatus,
  statusMessage,
  boardName,
  isSimulated,
  onConnect,
  onDisconnect,
  onToggleSimulation,
  onExportCsv,
  onAddGlucose,
  latestGlucoseRecord,
  activePatient,
  onOpenPatientModal,
  thresholds,
  onOpenThresholdModal,
  onOpenEditModal,
  onOpenAnimation,
}) => {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  // Display lines directly from hardware device photo or manual input
  const displayLine1 = currentData?.displayLines?.[0] || 'Glutor V2.0';
  const displayLine2 = currentData?.displayLines?.[1] || (currentData?.glucoseValue ? `Glucose:${currentData.glucoseValue} mg/dL` : 'Glucose:--- mg/dL');
  const displayLine3 = currentData?.displayLines?.[2] || (currentData?.voltageRaw ? `V = ${currentData.voltageRaw}` : 'V = ---');

  const glucoseVal = currentData?.glucoseValue ?? null;
  const voltageVal = currentData?.voltageRaw ?? null;
  const acetoneVal = currentData?.calibratedAcetonePpm ?? (voltageVal !== null ? Number((0.45 + (voltageVal / 1023) * 1.5).toFixed(2)) : null);

  // Evaluate clinical factors based on glucose
  const isFasting = !activePatient?.defaultMeasurementContext || 
    activePatient.defaultMeasurementContext === 'fasting' || 
    activePatient.defaultMeasurementContext === 'before_meal';

  // Threshold alerts evaluation
  const isGlucoseHigh = glucoseVal !== null && thresholds.alertsEnabled && glucoseVal >= thresholds.glucoseHigh;
  const isGlucoseLow = glucoseVal !== null && thresholds.alertsEnabled && glucoseVal < thresholds.glucoseLow;
  const isAcetoneHigh = acetoneVal !== null && thresholds.alertsEnabled && acetoneVal >= thresholds.acetoneHigh;
  const hasActiveAlert = isGlucoseHigh || isGlucoseLow || isAcetoneHigh;

  // Normal Fasting: 70 - 99 mg/dL
  // Pre-diabetes (Impaired Fasting Glucose): 100 - 125 mg/dL
  // Diabetes: >= 126 mg/dL
  let riskStatus: 'normal' | 'pre_diabetes' | 'high' = 'normal';
  if (glucoseVal !== null) {
    if (isFasting) {
      if (glucoseVal >= 126) riskStatus = 'high';
      else if (glucoseVal >= 100) riskStatus = 'pre_diabetes';
      else riskStatus = 'normal';
    } else {
      if (glucoseVal >= 200) riskStatus = 'high';
      else if (glucoseVal >= 140) riskStatus = 'pre_diabetes';
      else riskStatus = 'normal';
    }
  }

  return (
    <div className="space-y-6 py-2 max-w-6xl mx-auto">
      {/* Patient Header Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base">
            {activePatient?.fullName ? activePatient.fullName.charAt(0) : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">PATIENT:</span>
              <span className="font-bold text-white text-base">
                {activePatient?.fullName || 'Active Patient'}
              </span>
              {activePatient?.diabetesStatus === 'yes' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  DIABETES PROFILE
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 font-mono mt-0.5">
              <span>{activePatient?.age ? `${activePatient.age} yrs` : 'Age 30'}</span>
              <span>·</span>
              <span className="capitalize">{activePatient?.defaultMeasurementContext?.replace('_', ' ') || 'Fasting'}</span>
              <span>·</span>
              <span className="text-teal-400 capitalize">{activePatient?.dietaryPreference?.replace('_', ' ') || 'Standard Diet'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPatientModal}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Switch / Change Profile</span>
        </button>
      </div>

      {/* USB Connection & Hardware Controls Ribbon */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
              isConnected || currentData !== null
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}>
              <Usb className="w-5 h-5" />
            </div>
            {(isConnected || currentData !== null) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">
                {isConnected ? 'Prototype Connected' : currentData !== null ? 'Hardware Display Synchronized' : 'Prototype Standby'}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isConnected || currentData !== null
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isConnected ? '1 USB PORT ACTIVE (115200 BAUD)' : currentData !== null ? 'DISPLAY SYNCED' : 'AWAITING USB'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isConnected || currentData !== null
                ? 'Direct serial reading active · Reading prototype screen output directly or via calibration editor'
                : 'Connect prototype via USB (1 port) to read screen values, or edit values directly.'}
            </p>
          </div>
        </div>

        {/* Action Controls: Connect USB, Sync from Device, Alert Thresholds, How Glutor Works Animation */}
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Sync from Device Button */}
          <button
            onClick={onOpenEditModal}
            className="px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-950/50"
            title="Sync or calibrate the values shown on the hardware display"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync from Device</span>
          </button>

          {/* Working Animation Button */}
          {onOpenAnimation && (
            <button
              onClick={onOpenAnimation}
              className="px-3.5 py-2 text-xs font-semibold text-teal-300 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-800/80 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Watch step-by-step animation explaining how Glutor works"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>How Glutor Works</span>
            </button>
          )}

          {/* Alert Thresholds Config Button */}
          <button
            onClick={onOpenThresholdModal}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              hasActiveAlert
                ? 'text-amber-200 bg-amber-950/70 border-amber-500/80 animate-pulse'
                : 'text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border-slate-700'
            }`}
            title="Configure custom alert thresholds for Glucose and Acetone"
          >
            <Bell className={`w-3.5 h-3.5 ${hasActiveAlert ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Alert Thresholds</span>
            {hasActiveAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* USB Connect / Disconnect */}
          {isConnected ? (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-xl hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Disconnect</span>
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
              disabled={isConnecting}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Usb className="w-4 h-4 text-slate-950" />
              <span>{isConnecting ? 'Select 1 USB Port...' : 'Connect USB'}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* PROMINENT VISUAL WARNING ALERTS (When Current Data Exceeds Configured Thresholds) */}
      <AnimatePresence>
        {hasActiveAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="space-y-3"
          >
            {/* High Glucose Warning */}
            {isGlucoseHigh && (
              <div className="bg-gradient-to-r from-rose-950/90 to-red-900/80 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-xl shadow-rose-950/50 flex items-start gap-3.5 text-white animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center shrink-0 text-rose-300">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      <span>⚠️ HIGH GLUCOSE ALERT: HYPERGLYCEMIA WARNING</span>
                    </h4>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-rose-900/80 border border-rose-400 rounded-lg text-rose-200">
                      Reading: {glucoseVal} mg/dL &gt; Limit: {thresholds.glucoseHigh} mg/dL
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-100 mt-1 leading-relaxed">
                    Current prototype glucose reading of <strong>{glucoseVal} mg/dL</strong> exceeds your custom alert threshold of <strong>{thresholds.glucoseHigh} mg/dL</strong>. High circulating glucose levels increase metabolic strain. Follow standard clinical protocols and verify with a certified clinical test.
                  </p>
                </div>
              </div>
            )}

            {/* Low Glucose Warning */}
            {isGlucoseLow && (
              <div className="bg-gradient-to-r from-amber-950/90 to-yellow-900/80 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-xl shadow-amber-950/50 flex items-start gap-3.5 text-white">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0 text-amber-300">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      <span>⚠️ LOW GLUCOSE ALERT: HYPOGLYCEMIA WARNING</span>
                    </h4>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-900/80 border border-amber-400 rounded-lg text-amber-200">
                      Reading: {glucoseVal} mg/dL &lt; Floor: {thresholds.glucoseLow} mg/dL
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100 mt-1 leading-relaxed">
                    Current prototype glucose reading of <strong>{glucoseVal} mg/dL</strong> is below your low alert threshold of <strong>{thresholds.glucoseLow} mg/dL</strong>. Hypoglycemia risk requires immediate attention (e.g. 15g fast-acting carbohydrates).
                  </p>
                </div>
              </div>
            )}

            {/* High Breath Acetone Warning */}
            {isAcetoneHigh && (
              <div className="bg-gradient-to-r from-purple-950/90 to-fuchsia-900/80 border-2 border-purple-500 rounded-2xl p-4 sm:p-5 shadow-xl shadow-purple-950/50 flex items-start gap-3.5 text-white">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center shrink-0 text-purple-300">
                  <Flame className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      <span>⚠️ ELEVATED ACETONE LEVEL ALERT: HEIGHTENED KETONE CONCENTRATION</span>
                    </h4>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-purple-900/80 border border-purple-400 rounded-lg text-purple-200">
                      Exhaled: {acetoneVal?.toFixed(2)} ppm &gt; Limit: {thresholds.acetoneHigh.toFixed(2)} ppm
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-100 mt-1 leading-relaxed">
                    Measured breath acetone of <strong>{acetoneVal?.toFixed(2)} ppm</strong> exceeds your alert threshold of <strong>{thresholds.acetoneHigh.toFixed(2)} ppm</strong>. This indicates elevated ketone bodies in exhaled breath from prolonged fasting, ketogenic state, or potential metabolic acidosis.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HARDWARE DEVICE SCREEN SECTION (Exact match to prototype screen) */}
      <div className={`bg-[#0b101b] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all border-2 ${
        hasActiveAlert
          ? 'border-rose-500/60 ring-2 ring-rose-500/20'
          : 'border-cyan-900/40'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentData ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <h3 className="text-lg font-bold text-white tracking-wide">Hardware Device Live Screen</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact live mirror of your physical prototype display
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveAlert && (
              <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/80 border border-rose-500 px-3 py-1 rounded-full animate-bounce">
                ⚠️ THRESHOLD EXCEEDED
              </span>
            )}
            <button
              onClick={onOpenEditModal}
              className="text-xs font-mono text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/50 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync from Device</span>
            </button>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
              {currentData ? 'SCREEN SYNC ACTIVE' : 'SCREEN STANDBY'}
            </span>
          </div>
        </div>

        {/* Physical Display Mirror Frame: Styled exactly as the module in user's photo */}
        <div className="my-6 max-w-xl mx-auto">
          <div className={`bg-[#05070e] p-5 sm:p-7 rounded-2xl border-2 transition-all relative ${
            hasActiveAlert ? 'border-rose-500/80 shadow-2xl shadow-rose-950/50' : 'border-slate-700/80 shadow-2xl'
          }`}>
            {/* Header Pins on the left matching the blue board in photo: GND, VCC, SCL, SDA */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span>
                <span>GND</span>
                <span>VCC</span>
                <span>SCL</span>
                <span>SDA</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                I2C SCREEN BUS
              </span>
            </div>

            {/* Glowing Screen Area (Dark rectangular display with bright pixel font) */}
            <div className={`bg-[#00040a] border-2 rounded-xl p-6 sm:p-8 font-mono shadow-inner shadow-cyan-950/60 space-y-3 transition-colors ${
              hasActiveAlert ? 'border-rose-500/60' : 'border-cyan-500/50'
            }`}>
              {/* Line 1: Title */}
              <div className="text-lg sm:text-2xl font-bold tracking-widest text-cyan-200 flex items-center justify-between">
                <span>{displayLine1}</span>
                <span className="text-[10px] font-mono text-cyan-400/80 border border-cyan-700/40 px-2 py-0.5 rounded">
                  {currentData ? 'LIVE' : 'STANDBY'}
                </span>
              </div>

              {/* Line 2: Glucose Value */}
              <div className="text-2xl sm:text-3xl font-black tracking-wide text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                {displayLine2}
              </div>

              {/* Line 3: Voltage Value */}
              <div className="text-lg sm:text-2xl font-bold tracking-widest text-cyan-300/90 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                {displayLine3}
              </div>
            </div>

            {/* Hardware Sub-Label matching the Figaro HW-841 Sensor in photo */}
            <div className="flex items-center justify-between pt-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                HW-841 Gas Sensor Module
              </span>
              <span>
                {currentData ? 'Telemetry: Active' : 'Waiting for USB stream or edit'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Readout Value Cards directly beneath the screen */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-2">
          {/* Glucose Box */}
          <div className={`bg-slate-950/70 border rounded-2xl p-4 flex items-center justify-between ${
            isGlucoseHigh ? 'border-rose-500/80 ring-1 ring-rose-500/40' : isGlucoseLow ? 'border-amber-500/80 ring-1 ring-amber-500/40' : 'border-teal-500/30'
          }`}>
            <div>
              <span className="text-[11px] font-mono uppercase text-teal-400 block font-semibold">
                Measured Glucose
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-teal-300 tabular-nums">
                  {glucoseVal !== null ? glucoseVal : '--'}
                </span>
                <span className="text-sm font-mono text-slate-400 font-semibold">mg/dL</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-mono px-2 py-1 rounded block ${
                isGlucoseHigh ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : isGlucoseLow ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
              }`}>
                {glucoseVal !== null ? (isGlucoseHigh ? 'High Alert' : isGlucoseLow ? 'Low Alert' : 'Device Output') : 'No Reading'}
              </span>
            </div>
          </div>

          {/* Voltage Box */}
          <div className="bg-slate-950/70 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase text-cyan-400 block font-semibold">
                Sensor Voltage (V)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300 tabular-nums">
                  {voltageVal !== null ? voltageVal : '--'}
                </span>
                <span className="text-sm font-mono text-slate-400 font-semibold">raw</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 block">
                {voltageVal !== null ? 'Sensor Level' : 'No Reading'}
              </span>
            </div>
          </div>

          {/* Breath Acetone (ppm) */}
          <div className={`bg-slate-950/70 border rounded-2xl p-4 flex items-center justify-between ${
            isAcetoneHigh ? 'border-purple-500/80 ring-1 ring-purple-500/40' : 'border-purple-500/30'
          }`}>
            <div>
              <span className="text-[11px] font-mono uppercase text-purple-400 block font-semibold">
                Breath Acetone
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-purple-300 tabular-nums">
                  {acetoneVal !== null ? acetoneVal.toFixed(2) : '--'}
                </span>
                <span className="text-sm font-mono text-slate-400 font-semibold">ppm</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-mono px-2 py-1 rounded block ${
                isAcetoneHigh ? 'bg-purple-950/80 text-purple-300 border border-purple-800' : 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
              }`}>
                {acetoneVal !== null ? (isAcetoneHigh ? 'Elevated' : 'Calculated') : 'Standby'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ALL FACTORS UNDER THE DISPLAY: Diabetes Risk, Health Tips, Food Recommendations */}
      {currentData === null ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-lg font-bold text-white">Connect Device or Input Values to View Analysis</h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Once your prototype is connected via USB, or when you enter values using the "Edit Device Reading" button, all factors—diabetes risk level, glucose evaluation, personalized health tips, and food recommendations (what to eat vs. what to avoid)—will appear below.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onConnect}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Usb className="w-4 h-4" />
              <span>Connect USB</span>
            </button>
            <button
              onClick={onOpenEditModal}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Sync from Device</span>
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Factor 1: DIABETES RISK & GLUCOSE LEVEL EVALUATION */}
          <div className={`border rounded-3xl p-6 sm:p-7 shadow-xl transition-all ${
            riskStatus === 'high'
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              : riskStatus === 'pre_diabetes'
              ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {riskStatus === 'high' ? (
                  <ShieldAlert className="w-7 h-7 text-rose-400" />
                ) : riskStatus === 'pre_diabetes' ? (
                  <AlertTriangle className="w-7 h-7 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                )}
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    DIABETES FACTOR EVALUATION ({isFasting ? 'FASTING STATE' : 'POST-MEAL STATE'})
                  </span>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    {riskStatus === 'high'
                      ? `High Glucose Level (${glucoseVal} mg/dL) — Elevated Diabetes Risk`
                      : riskStatus === 'pre_diabetes'
                      ? `Mild Watch — Impaired Fasting Glucose (${glucoseVal} mg/dL)`
                      : `Low Risk — Normal Blood Glucose Range (${glucoseVal} mg/dL)`}
                  </h4>
                </div>
              </div>

              <span className={`text-xs font-mono px-3.5 py-1.5 rounded-full border self-start sm:self-auto font-bold uppercase tracking-wider ${
                riskStatus === 'high'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : riskStatus === 'pre_diabetes'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {riskStatus === 'high'
                  ? 'HIGH DIABETES RISK'
                  : riskStatus === 'pre_diabetes'
                  ? 'PRE-DIABETES WATCH'
                  : 'NO DIABETES RISK'}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-4">
              {riskStatus === 'pre_diabetes'
                ? `Your device reading is ${glucoseVal} mg/dL. Standard clinical criteria classify fasting glucose between 100 and 125 mg/dL as impaired fasting glucose (pre-diabetes range). While not overt diabetes (≥126 mg/dL), mild dietary vigilance and daily activity are recommended to return values to normal (<100 mg/dL).`
                : riskStatus === 'high'
                ? `Your device reading is ${glucoseVal} mg/dL, which is significantly elevated (≥126 mg/dL fasting or ≥200 mg/dL post-meal). Immediate medical guidance and confirmatory laboratory blood tests are strongly advised.`
                : `Your glucose reading is ${glucoseVal} mg/dL, which is within the optimal fasting reference range (<100 mg/dL). Excellent metabolic balance.`}
            </p>

            {/* Reference Range Bar */}
            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 block mb-2">
                CLINICAL FASTING REFERENCE BENCHMARK:
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className={`p-2.5 rounded-xl border ${glucoseVal !== null && glucoseVal < 100 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40' : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'}`}>
                  <div className="font-bold">&lt; 100 mg/dL</div>
                  <div className="text-[10px] text-emerald-400/80">Normal / Optimal</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${glucoseVal !== null && glucoseVal >= 100 && glucoseVal <= 125 ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/40' : 'bg-amber-950/40 border-amber-800/40 text-amber-300'}`}>
                  <div className="font-bold">100 – 125 mg/dL</div>
                  <div className="text-[10px] text-amber-400/80">Impaired (Pre-Diabetes)</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${glucoseVal !== null && glucoseVal >= 126 ? 'bg-rose-500/20 border-rose-400 text-rose-200 ring-2 ring-rose-400/40' : 'bg-rose-950/40 border-rose-800/40 text-rose-300'}`}>
                  <div className="font-bold">≥ 126 mg/dL</div>
                  <div className="text-[10px] text-rose-400/80">High Diabetes Risk</div>
                </div>
              </div>
            </div>
          </div>

          {/* Factor 2: HEALTH & LIFESTYLE TIPS */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <HeartPulse className="w-6 h-6 text-cyan-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Actionable Health Tips for {glucoseVal ? `${glucoseVal} mg/dL` : 'Current Reading'}</h4>
                <p className="text-xs text-slate-400">Personalized daily guidance to stabilize glucose levels</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Footprints className="w-4 h-4" />
                  <span>15-Min Post-Meal Walk</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A gentle 15-minute walk after meals prompts muscle cells to absorb circulating glucose without requiring extra insulin, dropping glucose back under 100 mg/dL.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Droplets className="w-4 h-4" />
                  <span>Stay Well Hydrated</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Drinking 2.5 to 3 liters of plain water throughout the day assists the kidneys in flushing surplus glucose via urine and keeps blood viscosity optimal.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Consistent Sleep Schedule</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Poor sleep raises morning cortisol, which triggers liver glucose release. Aim for 7 to 8 hours of uninterrupted sleep for lower fasting numbers.
                </p>
              </div>
            </div>
          </div>

          {/* Factor 3: FOOD RECOMMENDATIONS — WHAT TO EAT VS WHAT TO AVOID */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Utensils className="w-6 h-6 text-teal-400" />
              <div>
                <h4 className="text-lg font-bold text-white">Food Recommendations for Glucose Management</h4>
                <p className="text-xs text-slate-400">Dietary choices to keep your readings under control</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WHAT TO EAT (Recommended Foods) */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-emerald-800/40 pb-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>What to Eat (Recommended)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Green Leafy Vegetables:</strong> Spinach (palak), fenugreek (methi), cabbage, and cucumber, high in fiber with zero glycemic spikes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Bitter Gourd (Karela) &amp; Fenugreek:</strong> Proven to contain polypeptide-p and charantin that naturally modulate glucose absorption.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Whole Grains &amp; Millets:</strong> Oats, barley, ragi, and quinoa instead of refined carbohydrates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Legumes &amp; Lean Proteins:</strong> Moong dal, chickpeas, paneer, eggs, and tofu provide satiety and blunt insulin response.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Healthy Nuts &amp; Seeds:</strong> Almonds, walnuts, chia seeds, and flaxseeds rich in omega-3 and alpha-lipoic acid.</span>
                  </li>
                </ul>
              </div>

              {/* WHAT TO AVOID */}
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-rose-800/40 pb-2">
                  <Ban className="w-5 h-5 text-rose-400" />
                  <span>What to Avoid (Minimize / Stop)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Refined Sugars &amp; Sweets:</strong> Table sugar, mithai, cakes, pastries, candy, and sweetened tea/coffee.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Sweetened Drinks &amp; Sodas:</strong> Carbonated cold drinks, packaged fruit juices, and commercial energy drinks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Excess White Rice &amp; Refined Flour (Maida):</strong> Causes steep postprandial glucose surges; replace with brown rice or dalia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Deep-Fried Snacks:</strong> Pakoras, samosas, and commercial chips loaded with trans-fats that induce insulin resistance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span><strong>Ultra-Processed Foods:</strong> Instant noodles, preserved meats, and packaged ready-to-eat snack meals.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
