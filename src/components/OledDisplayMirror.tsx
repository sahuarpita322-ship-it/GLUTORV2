import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tv,
  Cpu,
  Zap,
  Wifi,
  Sparkles,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SerialDataPoint, ConnectionStatus } from '../types';

interface OledDisplayMirrorProps {
  currentData: SerialDataPoint | null;
  connectionStatus: ConnectionStatus;
  boardName: string;
  isSimulated: boolean;
  historyData: SerialDataPoint[];
}

export const OledDisplayMirror: React.FC<OledDisplayMirrorProps> = ({
  currentData,
  connectionStatus,
  boardName,
  isSimulated,
  historyData,
}) => {
  const [oledTheme, setOledTheme] = useState<'cyan' | 'white'>('cyan');
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'large'>('normal');

  const isConnected = connectionStatus === 'connected';
  const displayLine1 = currentData?.displayLines?.[0] || 'Glutor V2.0';
  const glucoseVal = currentData?.glucoseValue ?? null;
  const voltageVal = currentData?.voltageRaw ?? currentData?.acetoneRaw ?? null;
  const displayLine2 = currentData?.displayLines?.[1] || (glucoseVal !== null ? `Glucose:${glucoseVal} mg/dL` : 'Glucose:--- mg/dL');
  const displayLine3 = currentData?.displayLines?.[2] || (voltageVal !== null ? `V = ${voltageVal}` : 'V = ---');

  const acetonePpm = currentData?.calibratedAcetonePpm ?? (voltageVal ? (0.45 + (voltageVal / 1023) * 1.5).toFixed(2) : '--');
  const rawAdc = voltageVal ?? '--';
  const temp = currentData?.temperatureC ?? '--';
  const hum = currentData?.humidityPct ?? '--';

  // Breath bar calculation (0-100%)
  const breathProgress = voltageVal
    ? Math.min(100, Math.max(8, Math.round(((voltageVal - 40) / 200) * 100)))
    : 0;

  // Mini sparkline for the bottom OLED graph
  const recentPoints = historyData.slice(-18);
  const minAdc = 400;
  const maxAdc = 1000;

  return (
    <div className="relative">
      {/* Outer Hardware Chassis Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`mx-auto bg-[#0a0e17] rounded-3xl p-5 sm:p-6 border-2 border-slate-700/80 shadow-2xl shadow-cyan-950/30 relative overflow-hidden ${
          zoomLevel === 'large' ? 'max-w-2xl' : 'max-w-xl'
        }`}
      >
        {/* Hardware details: Corner mounting brass standoffs */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full border border-amber-600/60 bg-amber-900/30 flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-500/70 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full border border-amber-600/60 bg-amber-900/30 flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-500/70 -rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full border border-amber-600/60 bg-amber-900/30 flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-500/70 -rotate-45" />
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full border border-amber-600/60 bg-amber-900/30 flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-amber-500/70 rotate-45" />
        </div>

        {/* Chassis Top Bar: Microcontroller Silkscreen Label */}
        <div className="flex items-center justify-between mb-3 px-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              {boardName || 'USB MICROCONTROLLER'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] text-cyan-400">128×64 I2C SCREEN</span>
          </div>

          <div className="flex items-center gap-2">
            {isSimulated && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ACTIVE
              </span>
            )}
            <button
              onClick={() => setZoomLevel(zoomLevel === 'normal' ? 'large' : 'normal')}
              className="text-slate-500 hover:text-white p-1 rounded transition-colors"
              title="Toggle OLED zoom"
            >
              {zoomLevel === 'normal' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* PHYSICAL OLED SCREEN BEZEL */}
        <div className="relative rounded-2xl p-2 bg-[#020408] border border-slate-800 shadow-inner">
          
          {/* Glass glare effect */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl pointer-events-none" />

          {/* Dot Matrix OLED Screen Surface */}
          <div
            className={`rounded-xl p-4 sm:p-5 font-mono select-none relative overflow-hidden transition-all duration-300 ${
              oledTheme === 'cyan'
                ? 'bg-black text-cyan-300'
                : 'bg-black text-slate-100'
            }`}
            style={{
              boxShadow: isConnected
                ? 'inset 0 0 25px rgba(6, 182, 212, 0.15), 0 0 15px rgba(6, 182, 212, 0.1)'
                : 'none',
              letterSpacing: '0.05em',
            }}
          >
            {/* Scanlines layer */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)',
              }}
            />

            {!isConnected ? (
              /* Disconnected Screen State */
              <div className="h-44 sm:h-52 flex flex-col items-center justify-center text-center space-y-3">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="w-10 h-10 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-600"
                >
                  <Tv className="w-5 h-5 text-slate-500" />
                </motion.div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    SCREEN STANDBY
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Connect USB to mirror hardware screen
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE LIVE PHYSICAL HARDWARE SCREEN MIRROR */
              <div className="space-y-3 relative z-10">
                {/* Physical Screen Format matching User Photo: Glutor V2.0 */}
                <div className="py-2 px-2 font-mono space-y-2 select-none text-left bg-black rounded-lg border border-cyan-950">
                  <div className="text-base sm:text-xl font-bold tracking-wider text-cyan-200 flex items-center justify-between border-b border-cyan-800/40 pb-1.5">
                    <span>{displayLine1}</span>
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
                      I2C 0x3C
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    {displayLine2}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-teal-300 tracking-wider">
                    {displayLine3}
                  </div>
                </div>

                {/* Live Exhalation Intensity Gauge */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] opacity-75">
                    <span>HW-841 SENSOR ACTIVITY:</span>
                    <span>{breathProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-sm border border-cyan-500/30 p-0.5">
                    <motion.div
                      className="h-full bg-cyan-400 rounded-xs"
                      animate={{ width: `${breathProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>

                {/* OLED Zone 4: Micro Environment & Pixel Trend Ribbon */}
                <div className="flex items-center justify-between pt-1 text-[11px] border-t border-dashed border-current/30">
                  <div className="flex items-center gap-3 opacity-80">
                    <span>T:{temp}°C</span>
                    <span>H:{hum}%</span>
                  </div>

                  {/* Mini Pixel Sparkline Waveform */}
                  <div className="flex items-end gap-0.5 h-4">
                    {recentPoints.map((p, i) => {
                      const val = p.acetoneRaw ?? 450;
                      const norm = Math.max(2, Math.min(16, Math.round(((val - minAdc) / (maxAdc - minAdc)) * 14)));
                      return (
                        <div
                          key={i}
                          style={{ height: `${norm}px` }}
                          className="w-1 bg-current opacity-80"
                        />
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Chassis Controls / Theme Toggles */}
        <div className="flex items-center justify-between mt-3 px-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase">THEME:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setOledTheme('cyan')}
                className={`w-4 h-4 rounded-full border transition-all ${
                  oledTheme === 'cyan' ? 'border-cyan-400 scale-110 ring-2 ring-cyan-500/50' : 'border-slate-700 opacity-60'
                } bg-cyan-400`}
                title="Medical Cyan"
              />
              <button
                onClick={() => setOledTheme('white')}
                className={`w-4 h-4 rounded-full border transition-all ${
                  oledTheme === 'white' ? 'border-white scale-110 ring-2 ring-white/50' : 'border-slate-700 opacity-60'
                } bg-slate-100`}
                title="Crystal White"
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-500">
            {isConnected ? 'LIVE USB MIRROR ACTIVE' : 'AWAITING USB CONNECTION'}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
