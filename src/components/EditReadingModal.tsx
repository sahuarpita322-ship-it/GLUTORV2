import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, Check, X, Sparkles, Activity, Cpu, RotateCcw, RefreshCw } from 'lucide-react';
import { SerialDataPoint } from '../types';

interface EditReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: SerialDataPoint | null;
  onSaveReading: (data: {
    deviceTitle: string;
    glucoseValue: number;
    voltageRaw: number;
    acetonePpm: number;
  }) => void;
}

export const EditReadingModal: React.FC<EditReadingModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSaveReading,
}) => {
  const [deviceTitle, setDeviceTitle] = useState<string>(
    currentData?.deviceTitle || currentData?.displayLines?.[0] || 'Glutor V2.0'
  );
  const [glucose, setGlucose] = useState<string>(
    currentData?.glucoseValue !== null && currentData?.glucoseValue !== undefined
      ? String(currentData.glucoseValue)
      : '109'
  );
  const [voltage, setVoltage] = useState<string>(
    currentData?.voltageRaw !== null && currentData?.voltageRaw !== undefined
      ? String(currentData.voltageRaw)
      : '139'
  );
  const [acetone, setAcetone] = useState<string>(
    currentData?.calibratedAcetonePpm !== null && currentData?.calibratedAcetonePpm !== undefined
      ? String(currentData.calibratedAcetonePpm)
      : '0.65'
  );

  if (!isOpen) return null;

  // Auto calculate acetone ppm when voltage is edited
  const handleVoltageChange = (val: string) => {
    setVoltage(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      const autoPpm = (0.45 + (num / 1023) * 1.5).toFixed(2);
      setAcetone(autoPpm);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gVal = parseFloat(glucose) || 100;
    const vVal = parseFloat(voltage) || 139;
    const aVal = parseFloat(acetone) || 0.65;

    onSaveReading({
      deviceTitle: deviceTitle.trim() || 'Glutor V2.0',
      glucoseValue: Math.round(gVal),
      voltageRaw: Math.round(vVal),
      acetonePpm: aVal,
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
          className="bg-[#0b101b] border border-cyan-500/50 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Sync from Device</h3>
                <p className="text-xs text-slate-400">
                  Synchronize or calibrate the exact values shown on your Glutor V2.0 prototype
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Field 1: Device Header / Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                Line 1: Device Title / Header
              </label>
              <input
                type="text"
                value={deviceTitle}
                onChange={(e) => setDeviceTitle(e.target.value)}
                placeholder="Glutor V2.0"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-cyan-300 font-mono focus:border-cyan-400 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Top line displayed on the prototype screen (e.g. Glutor V2.0)
              </span>
            </div>

            {/* Field 2: Glucose Value (mg/dL) */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1.5 font-mono">
                Line 2: Glucose Level (mg/dL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="600"
                  step="1"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  placeholder="e.g. 109"
                  className="w-full bg-slate-900 border border-teal-600/60 rounded-xl px-3.5 py-2.5 text-base text-teal-300 font-mono font-bold focus:border-teal-400 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono text-slate-400">
                  mg/dL
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Direct glucose output (e.g. Glucose: 109 mg/dL)
              </span>
            </div>

            {/* Field 3: Voltage / Raw ADC (V = ...) */}
            <div>
              <label className="block text-xs font-semibold text-cyan-300 mb-1.5 font-mono">
                Line 3: Sensor Voltage Value (V)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="4095"
                  step="1"
                  value={voltage}
                  onChange={(e) => handleVoltageChange(e.target.value)}
                  placeholder="e.g. 139"
                  className="w-full bg-slate-900 border border-cyan-600/60 rounded-xl px-3.5 py-2.5 text-base text-cyan-300 font-mono font-bold focus:border-cyan-400 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono text-slate-400">
                  raw V
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Sensor analog voltage or raw level from hardware (e.g. V = 139)
              </span>
            </div>

            {/* Field 4: Exhaled Breath Acetone (ppm) */}
            <div>
              <label className="block text-xs font-semibold text-purple-300 mb-1.5 font-mono">
                Exhaled Breath Acetone (ppm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  max="10.0"
                  step="0.01"
                  value={acetone}
                  onChange={(e) => setAcetone(e.target.value)}
                  placeholder="e.g. 0.65"
                  className="w-full bg-slate-900 border border-purple-600/60 rounded-xl px-3.5 py-2.5 text-base text-purple-300 font-mono font-bold focus:border-purple-400 focus:outline-none"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-mono text-slate-400">
                  ppm
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                Calculated from sensor voltage; can be adjusted manually
              </span>
            </div>

            {/* Hardware Screen Preview */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block font-semibold mb-1">
                Preview of Hardware Screen Output:
              </span>
              <div className="text-cyan-200">{deviceTitle || 'Glutor V2.0'}</div>
              <div className="text-teal-300">Glucose:{glucose || '---'} mg/dL</div>
              <div className="text-cyan-300/90">V = {voltage || '---'}</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Sync &amp; Display on Website</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
