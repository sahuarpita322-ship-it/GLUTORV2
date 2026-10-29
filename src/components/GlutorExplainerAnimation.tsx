import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind,
  Cpu,
  Tv,
  Usb,
  Zap,
  Activity,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ChevronRight,
  Layers,
  HeartPulse,
  Sliders,
  Bell
} from 'lucide-react';

interface GlutorExplainerAnimationProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface StepInfo {
  number: number;
  title: string;
  tagline: string;
  badge: string;
  description: string;
  hardwareFocus: string;
}

const STEPS: StepInfo[] = [
  {
    number: 1,
    title: 'Exhaled Breath & Acetone Molecule Capture',
    tagline: 'Non-invasive breath sampling replaces painful fingersticks',
    badge: 'STAGE 1 · GAS SAMPLING',
    description:
      'The user exhales steadily into the Glutor sampling inlet. Exhaled breath contains volatile organic compounds (VOCs), including breath acetone (CH₃COCH₃), which is produced in the liver during fat metabolism and directly correlates with glycemic shifts.',
    hardwareFocus: 'Inlet Tube & Sampling Chamber',
  },
  {
    number: 2,
    title: 'HW-841 Figaro Sensor & Voltage Conversion',
    tagline: 'Semiconductor reaction generates direct analog voltage (V = 139)',
    badge: 'STAGE 2 · SENSOR REACTION',
    description:
      'The breath reaches the Figaro HW-841 gas sensor. Heated metal-oxide nanoparticles (SnO₂) react with acetone molecules, releasing trapped electrons. This alters electrical conductivity, instantly producing an analog voltage reading (e.g. V = 139).',
    hardwareFocus: 'Figaro HW-841 Gas Sensor Module',
  },
  {
    number: 3,
    title: 'Onboard Microprocessor & Calibration Engine',
    tagline: 'Translating voltage and breath acetone into clinical glucose',
    badge: 'STAGE 3 · SIGNAL PROCESSING',
    description:
      'The onboard processor samples the sensor voltage V and calculates correlated blood glucose levels (e.g. Glucose: 109 mg/dL). Baseline drift, temperature, and ambient humidity are mathematically stabilized in real time.',
    hardwareFocus: 'High-Speed Processing Controller',
  },
  {
    number: 4,
    title: 'Real-Time Hardware Screen Output',
    tagline: 'Immediate 3-line display rendering matching the prototype',
    badge: 'STAGE 4 · HARDWARE DISPLAY',
    description:
      'The prototype renders the results directly on its physical display: Line 1: Glutor V2.0, Line 2: Glucose: 109 mg/dL, Line 3: V = 139. Results are clear, instantaneous, and readable in under 5 seconds.',
    hardwareFocus: 'Hardware Display Mirror (I2C Bus)',
  },
  {
    number: 5,
    title: '1 USB Port Direct Stream to GLUTOR.V2',
    tagline: 'Zero-cloud serial telemetry, alert thresholds & health factors',
    badge: 'STAGE 5 · WEB TELEMETRY',
    description:
      'Through a single USB connection (115200 baud), data streams directly into this GLUTOR.V2 web dashboard. The platform evaluates diabetes risk factors, triggers custom high/low glucose & acetone alerts, and provides tailored food recommendations.',
    hardwareFocus: 'Web Serial 1-Port Live Telemetry',
  },
];

export const GlutorExplainerAnimation: React.FC<GlutorExplainerAnimationProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const stepDuration = 6000; // 6 seconds per step

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100;
    const increment = (intervalTime / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep((s) => s + 1);
            return 0;
          } else {
            // Finished all steps
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
    }
  };

  const handleSelectStep = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
  };

  const active = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-[#06080e]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100 overflow-y-auto selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Top Header & Skip Control */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
            <Tv className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white tracking-tight">GLUTOR.V2</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded">
                HOW IT WORKS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Working Principles of Non-Invasive Breath Acetone Sensing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSkip || onComplete}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            Skip to Dashboard →
          </button>
        </div>
      </header>

      {/* Main Animation & Explanation Stage */}
      <main className="max-w-6xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Visual Animation Canvas */}
        <div className="lg:col-span-7 bg-[#0b101b] border border-cyan-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[420px]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Animation Content By Step */}
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center space-y-6 relative z-10"
              >
                {/* Visual: Breath Stream to Sampling Inlet */}
                <div className="relative w-full max-w-md h-52 flex items-center justify-between px-6 bg-[#04060b] rounded-2xl border border-cyan-900/40 p-4">
                  {/* Breath Exhalation Source */}
                  <div className="flex flex-col items-center space-y-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20"
                    >
                      <Wind className="w-7 h-7 animate-pulse" />
                    </motion.div>
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase">
                      User Exhalation
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Normal Tidal Breath</span>
                  </div>

                  {/* Flowing Acetone Molecules Animation */}
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden h-24">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [-40, 140],
                          opacity: [0, 1, 1, 0],
                          scale: [0.8, 1.2, 0.9],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.2,
                          delay: i * 0.35,
                          ease: 'easeInOut',
                        }}
                        className="absolute flex items-center gap-1 bg-purple-950/80 border border-purple-500/70 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-sm shadow-purple-500/40"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                        <span>CH₃COCH₃</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Inlet Sampling Chamber */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-teal-950/40 border-2 border-teal-500/60 flex items-center justify-center text-teal-300 shadow-lg shadow-teal-500/20">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono text-teal-300 font-bold uppercase">
                      Sensor Chamber
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">HW-841 Figaro Inlet</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-4 py-2 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Volatile acetone molecules captured with zero capillary finger-stick blood!</span>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center space-y-6 relative z-10"
              >
                {/* Visual: Semiconductor Sensor Heating & Voltage Generation */}
                <div className="w-full max-w-md bg-[#04060b] rounded-2xl border border-cyan-900/40 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-purple-300 flex items-center gap-2 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                      HW-841 Figaro Gas Sensor Micro-Reaction
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">SnO₂ Nanocrystals</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    {/* Heating Element */}
                    <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <Flame className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Heating Grid</div>
                      <div className="text-xs font-bold text-amber-300 font-mono">350°C Micro-Heater</div>
                    </div>

                    <div className="text-xl text-slate-600 font-mono">→</div>

                    {/* Conductivity Change */}
                    <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <Zap className="w-6 h-6 text-cyan-400 mx-auto" />
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Resistance Drop</div>
                      <div className="text-xs font-bold text-cyan-300 font-mono">e⁻ Electron Release</div>
                    </div>

                    <div className="text-xl text-slate-600 font-mono">→</div>

                    {/* Direct Voltage V */}
                    <div className="flex-1 bg-slate-950 p-3 rounded-xl border border-teal-500/50 text-center space-y-1 shadow-md shadow-teal-500/20">
                      <Activity className="w-6 h-6 text-teal-400 mx-auto animate-pulse" />
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Analog Voltage</div>
                      <div className="text-base font-black text-teal-300 font-mono">V = 139</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
                    Sensor conductivity shifts proportionally to acetone concentration, outputting measurable raw voltage level <strong className="text-cyan-300">V = 139</strong>.
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center space-y-6 relative z-10"
              >
                {/* Visual: Core Processor & Calibration Math */}
                <div className="w-full max-w-md bg-[#04060b] rounded-2xl border border-cyan-900/40 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-cyan-300 flex items-center gap-2 font-bold">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Onboard Processing Engine
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">12-Bit ADC Processing</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="text-[10px] uppercase text-slate-500">Input Raw Signal:</div>
                      <div className="flex justify-between items-center text-cyan-300 font-bold">
                        <span>Raw Voltage Level (V):</span>
                        <span className="text-sm">139</span>
                      </div>
                    </div>

                    <div className="flex justify-center text-cyan-500 font-bold text-xs py-0.5">
                      ↓ Correlative Algorithm (Acetone PPM → Glucose mg/dL)
                    </div>

                    <div className="bg-gradient-to-r from-teal-950/60 to-slate-950 p-3 rounded-xl border border-teal-500/50 space-y-1.5">
                      <div className="text-[10px] uppercase text-teal-400">Computed Glucose Value:</div>
                      <div className="flex justify-between items-center text-teal-200 font-bold">
                        <span>Calculated Glucose:</span>
                        <span className="text-lg font-black text-teal-300">109 mg/dL</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Calibrated breath acetone: <strong>0.65 ppm</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center space-y-4 relative z-10"
              >
                {/* Visual: Exact Hardware Prototype Screen */}
                <div className="bg-[#05070e] p-5 sm:p-6 rounded-2xl border-2 border-cyan-500/60 shadow-2xl shadow-cyan-950/60 w-full max-w-sm font-mono relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-[10px] text-slate-500 uppercase tracking-widest">
                    <span>GND · VCC · SCL · SDA</span>
                    <span className="text-cyan-400">HARDWARE SCREEN</span>
                  </div>

                  {/* Glowing Dark Screen Box */}
                  <div className="bg-[#00040a] border-2 border-cyan-500/50 rounded-xl p-5 space-y-2.5 shadow-inner shadow-cyan-950/60">
                    <div className="text-xl font-bold tracking-widest text-cyan-200">
                      Glutor V2.0
                    </div>
                    <div className="text-2xl font-black text-teal-300 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                      Glucose:109 mg/dL
                    </div>
                    <div className="text-xl font-bold text-cyan-300/90 drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">
                      V = 139
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 text-[11px] text-purple-300">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      HW-841 Sensor
                    </span>
                    <span className="text-teal-400 font-mono text-[10px]">Real-Time Sync</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-400 text-center">
                  Matches your physical prototype display with line-by-line fidelity!
                </span>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center space-y-5 relative z-10"
              >
                {/* Visual: 1 USB Port to Web Dashboard */}
                <div className="w-full max-w-md bg-[#04060b] rounded-2xl border border-cyan-900/40 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-cyan-300 flex items-center gap-2 font-bold">
                      <Usb className="w-4 h-4 text-cyan-400" />
                      1 USB Port Connection
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      115200 BAUD
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-500 text-[10px] uppercase">Alert Thresholds:</div>
                      <div className="text-amber-300 font-bold flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5" />
                        <span>High / Low Limits</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Custom warning banners</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-500 text-[10px] uppercase">Clinical Guidance:</div>
                      <div className="text-emerald-300 font-bold flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5" />
                        <span>Lifestyle &amp; Foods</span>
                      </div>
                      <div className="text-[10px] text-slate-400">What to eat vs avoid</div>
                    </div>
                  </div>

                  <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3 text-[11px] font-mono text-cyan-200 text-center">
                    Full metabolic picture, sync controls, and continuous audit tracking right in your browser!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Step Indicator Dots */}
          <div className="flex items-center gap-2 mt-6">
            {STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-8 bg-cyan-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to Step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Narrative & Technical Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider px-2.5 py-1 bg-cyan-950/60 border border-cyan-800/50 rounded-lg inline-block">
              {active.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {active.title}
            </h2>
            <p className="text-sm text-teal-300 font-medium">
              {active.tagline}
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5">
            {active.description}
          </p>

          <div className="p-3.5 rounded-xl bg-[#090d18] border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase text-[10px]">Active Hardware Module:</span>
            <span className="text-cyan-300 font-bold">{active.hardwareFocus}</span>
          </div>

          {/* Step Progress Bar & Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Step {currentStep + 1} of {STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous Step"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {currentStep === STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Enter GLUTOR.V2 Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-800/60 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Footer Indicators */}
      <footer className="max-w-6xl w-full mx-auto pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Glutor V2.0 Working Demonstration</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSelectStep(0)}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            ↺ Replay from Step 1
          </button>
          <span>·</span>
          <button
            onClick={onComplete}
            className="text-cyan-400 font-bold hover:underline cursor-pointer"
          >
            Launch Dashboard →
          </button>
        </div>
      </footer>
    </div>
  );
};
