import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tv,
  Zap,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Cpu
} from 'lucide-react';
import { SerialDataPoint, ConnectionStatus, UserProfile } from '../types';

interface LcdDisplayMirrorProps {
  currentData: SerialDataPoint | null;
  connectionStatus: ConnectionStatus;
  boardName: string;
  isSimulated: boolean;
  activePatient: UserProfile | null;
}

export const LcdDisplayMirror: React.FC<LcdDisplayMirrorProps> = ({
  currentData,
  connectionStatus,
  boardName,
  isSimulated,
  activePatient,
}) => {
  const [backlightColor, setBacklightColor] = useState<'cyan' | 'blue' | 'dark'>('cyan');
  const [lcdMode, setLcdMode] = useState<'16x2' | '20x4'>('16x2');

  const isConnected = connectionStatus === 'connected';
  const glucoseVal = currentData?.glucoseValue ?? null;
  const voltageVal = currentData?.voltageRaw ?? currentData?.acetoneRaw ?? null;

  // Format 16-character lines for 16x2 screen matching physical Glutor device
  const getLine1 = () => {
    if (glucoseVal !== null) {
      return `Glucose:${glucoseVal}mg/dL`.padEnd(16, ' ').slice(0, 16);
    }
    return 'Glutor V2.0     ';
  };

  const getLine2 = () => {
    if (voltageVal !== null) {
      return `V = ${voltageVal}  ACTIVE`.padEnd(16, ' ').slice(0, 16);
    }
    return isConnected ? 'Glucose:--- mg/d' : 'CONNECT USB PORT';
  };

  // Additional lines for 20x4 mode
  const get20x4Lines = () => {
    if (!isConnected && glucoseVal === null) {
      return [
        '*** GLUTOR V2.0 *** ',
        'STATUS: STANDBY     ',
        'PLUG USB TO MONITOR ',
        'I2C ADDR: 0x3C/0x27 ',
      ];
    }

    const gluStr = glucoseVal !== null ? `${glucoseVal} mg/dL` : '--- mg/dL';
    const vStr = voltageVal !== null ? `V = ${voltageVal}` : 'V = ---';

    return [
      '*** GLUTOR V2.0 *** '.slice(0, 20),
      `GLUCOSE: ${gluStr}`.padEnd(20, ' ').slice(0, 20),
      `VOLTAGE: ${vStr}`.padEnd(20, ' ').slice(0, 20),
      `HW-841 SENSOR ACTIVE`.padEnd(20, ' ').slice(0, 20),
    ];
  };

  const line1 = getLine1();
  const line2 = getLine2();
  const lines20x4 = get20x4Lines();

  // Helper to render individual 5x8 character cell with LCD pixel grid
  const renderCharacterCell = (char: string, index: number) => {
    return (
      <div
        key={index}
        className="w-5 h-8 sm:w-6 sm:h-9 flex items-center justify-center font-mono font-bold text-sm sm:text-base border border-black/10 rounded-[1px] relative shadow-xs"
        style={{
          fontFamily: '"Courier New", Courier, monospace',
        }}
      >
        <span>{char === ' ' ? '\u00A0' : char}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-xl bg-[#0e141f] rounded-3xl p-5 sm:p-6 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden"
    >
      {/* Corner mounting screws */}
      <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full border border-slate-500 bg-slate-800 flex items-center justify-center">
        <div className="w-2 h-0.5 bg-slate-400 rotate-45" />
      </div>
      <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full border border-slate-500 bg-slate-800 flex items-center justify-center">
        <div className="w-2 h-0.5 bg-slate-400 -rotate-45" />
      </div>
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full border border-slate-500 bg-slate-800 flex items-center justify-center">
        <div className="w-2 h-0.5 bg-slate-400 -rotate-45" />
      </div>
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full border border-slate-500 bg-slate-800 flex items-center justify-center">
        <div className="w-2 h-0.5 bg-slate-400 rotate-45" />
      </div>

      {/* Hardware Silkscreen Header */}
      <div className="flex items-center justify-between mb-3 px-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            DIGITAL SCREEN HARDWARE MIRROR
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] text-cyan-400 font-bold">I2C (0x27)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-950 p-0.5 rounded border border-slate-800 flex text-[10px]">
            <button
              onClick={() => setLcdMode('16x2')}
              className={`px-2 py-0.5 rounded ${lcdMode === '16x2' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500'}`}
            >
              16×2
            </button>
            <button
              onClick={() => setLcdMode('20x4')}
              className={`px-2 py-0.5 rounded ${lcdMode === '20x4' ? 'bg-slate-800 text-white font-bold' : 'text-slate-500'}`}
            >
              20×4
            </button>
          </div>
        </div>
      </div>

      {/* PHYSICAL SCREEN BEZEL & SCREEN */}
      <div className="rounded-2xl p-3 sm:p-4 bg-[#05070a] border border-slate-800 shadow-inner">
        {/* Metal frame clip border */}
        <div className="p-3 sm:p-4 rounded-xl border-4 border-slate-800/90 shadow-2xl relative overflow-hidden">
          
          {/* Screen surface with modern crisp digital screen styles */}
          <div
            className={`p-4 rounded-lg select-none transition-colors duration-300 relative shadow-inner overflow-hidden ${
              backlightColor === 'cyan'
                ? 'bg-[#031322] text-[#38bdf8]' // Crisp Medical Cyan
                : backlightColor === 'blue'
                ? 'bg-[#081738] text-[#93c5fd]' // Deep Cobalt Blue
                : 'bg-[#060e17] text-[#2dd4bf]' // Obsidian Teal
            }`}
            style={{
              boxShadow: isConnected
                ? backlightColor === 'cyan'
                  ? 'inset 0 0 35px rgba(0,0,0,0.6), 0 0 20px rgba(56,189,248,0.3)'
                  : backlightColor === 'blue'
                  ? 'inset 0 0 35px rgba(0,0,0,0.6), 0 0 20px rgba(147,197,253,0.3)'
                  : 'inset 0 0 35px rgba(0,0,0,0.6), 0 0 20px rgba(45,212,191,0.3)'
                : 'inset 0 0 30px rgba(0,0,0,0.7)',
            }}
          >
            {/* Liquid Crystal Grid Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
                backgroundSize: '4px 4px',
              }}
            />

            {/* Render 16x2 or 20x4 Mode */}
            {lcdMode === '16x2' ? (
              <div className="space-y-2 relative z-10">
                {/* Row 1: 16 character cells */}
                <div className="flex justify-between items-center gap-0.5 overflow-x-auto py-1">
                  {line1.split('').map((char, idx) => renderCharacterCell(char, idx))}
                </div>

                {/* Row 2: 16 character cells */}
                <div className="flex justify-between items-center gap-0.5 overflow-x-auto py-1">
                  {line2.split('').map((char, idx) => renderCharacterCell(char, idx + 16))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 relative z-10">
                {lines20x4.map((rowText, rowIdx) => (
                  <div key={rowIdx} className="flex justify-between items-center gap-0.5 overflow-x-auto py-0.5">
                    {rowText.split('').map((char, colIdx) =>
                      renderCharacterCell(char, rowIdx * 20 + colIdx)
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chassis Controls: Backlight Theme & Hardware Pins */}
      <div className="flex items-center justify-between mt-3 px-2 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase">THEME:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setBacklightColor('cyan')}
              className={`w-4 h-4 rounded-full border transition-all ${
                backlightColor === 'cyan' ? 'border-cyan-400 scale-110 ring-2 ring-cyan-500/50' : 'border-slate-700 opacity-60'
              } bg-[#061e30]`}
              title="Medical Cyan"
            />
            <button
              onClick={() => setBacklightColor('blue')}
              className={`w-4 h-4 rounded-full border transition-all ${
                backlightColor === 'blue' ? 'border-sky-400 scale-110 ring-2 ring-sky-500/50' : 'border-slate-700 opacity-60'
              } bg-[#081738]`}
              title="Cobalt Blue"
            />
            <button
              onClick={() => setBacklightColor('dark')}
              className={`w-4 h-4 rounded-full border transition-all ${
                backlightColor === 'dark' ? 'border-teal-400 scale-110 ring-2 ring-teal-500/50' : 'border-slate-700 opacity-60'
              } bg-[#060e17]`}
              title="Obsidian Teal"
            />
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          {isConnected ? 'I2C SCREEN BUS ACTIVE' : 'AWAITING USB CONNECTION'}
        </div>
      </div>
    </motion.div>
  );
};
