import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Sliders,
  AlertTriangle,
  X,
  Check,
  RotateCcw,
  ShieldAlert,
  Flame,
  Activity
} from 'lucide-react';
import { AlertThresholds } from '../types';

interface ThresholdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholds: AlertThresholds;
  onSaveThresholds: (newThresholds: AlertThresholds) => void;
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  glucoseHigh: 140, // Hyperglycemia threshold (> 140 mg/dL normal post-meal, > 100 fasting)
  glucoseLow: 70,   // Hypoglycemia threshold (< 70 mg/dL)
  acetoneHigh: 1.20, // High breath acetone / ketosis threshold (> 1.20 ppm)
  soundEnabled: false,
  alertsEnabled: true,
};

export const ThresholdConfigModal: React.FC<ThresholdConfigModalProps> = ({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
}) => {
  const [glucoseHigh, setGlucoseHigh] = useState<number>(thresholds.glucoseHigh);
  const [glucoseLow, setGlucoseLow] = useState<number>(thresholds.glucoseLow);
  const [acetoneHigh, setAcetoneHigh] = useState<number>(thresholds.acetoneHigh);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(thresholds.alertsEnabled);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(thresholds.soundEnabled);

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    setGlucoseHigh(DEFAULT_THRESHOLDS.glucoseHigh);
    setGlucoseLow(DEFAULT_THRESHOLDS.glucoseLow);
    setAcetoneHigh(DEFAULT_THRESHOLDS.acetoneHigh);
    setAlertsEnabled(DEFAULT_THRESHOLDS.alertsEnabled);
    setSoundEnabled(DEFAULT_THRESHOLDS.soundEnabled);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveThresholds({
      glucoseHigh: Math.max(80, Math.min(350, glucoseHigh)),
      glucoseLow: Math.max(40, Math.min(100, glucoseLow)),
      acetoneHigh: Math.max(0.2, Math.min(10.0, acetoneHigh)),
      alertsEnabled,
      soundEnabled,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#0b101b] border border-cyan-800/60 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Alert Thresholds Configuration</h3>
                <p className="text-xs text-slate-400">
                  Set custom safety limits for Glucose and Acetone levels
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-5 space-y-5">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white">Enable Real-Time Visual Warnings</div>
                  <div className="text-[11px] text-slate-400">
                    Display alert banners when prototype data exceeds thresholds
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Threshold 1: High Glucose Limit */}
            <div className="space-y-2 p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>High Glucose Alert Threshold (Hyperglycemia)</span>
                </label>
                <span className="text-xs font-mono font-bold text-rose-400">
                  {glucoseHigh} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="250"
                step="5"
                value={glucoseHigh}
                onChange={(e) => setGlucoseHigh(parseInt(e.target.value, 10))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>100 mg/dL (Strict Fasting)</span>
                <span>140 mg/dL (ADA Post-meal standard)</span>
                <span>250 mg/dL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If the measured glucose equals or exceeds this value, a prominent red alert banner will warn of hyperglycemia.
              </p>
            </div>

            {/* Threshold 2: Low Glucose Limit */}
            <div className="space-y-2 p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Low Glucose Alert Threshold (Hypoglycemia)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {glucoseLow} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={glucoseLow}
                onChange={(e) => setGlucoseLow(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>50 mg/dL (Severe Hypo)</span>
                <span>70 mg/dL (Standard Clinical Floor)</span>
                <span>90 mg/dL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If glucose drops below this limit, an amber warning will highlight hypoglycemia risk.
              </p>
            </div>

            {/* Threshold 3: High Acetone Limit */}
            <div className="space-y-2 p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>Elevated Breath Acetone Threshold</span>
                </label>
                <span className="text-xs font-mono font-bold text-purple-400">
                  {acetoneHigh.toFixed(2)} ppm
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="3.00"
                step="0.05"
                value={acetoneHigh}
                onChange={(e) => setAcetoneHigh(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.50 ppm</span>
                <span>1.20 ppm (Ketosis / Metabolic Alert)</span>
                <span>3.00 ppm</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Triggers when exhaled breath acetone exceeds this level, indicating heightened fat oxidation or potential ketoacidosis risk in diabetic profiles.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Save Thresholds</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
