import React, { useState } from 'react';
import {
  Wind,
  Cpu,
  Usb,
  LayoutDashboard,
  FlaskConical,
  HeartHandshake,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  FileText,
  CheckCircle,
  HelpCircle,
  Microscope,
  Info
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onConnectClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onConnectClick }) => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [activeMoleculeView, setActiveMoleculeView] = useState<'2d' | '3d'>('2d');

  const workflowSteps = [
    {
      step: 1,
      title: 'Breath Sample',
      icon: Wind,
      badge: 'Exhalation',
      description: 'End-expiratory alveolar breath is delivered into the sampling chamber through a specialized mouthpiece that condenses moisture.',
      detail: 'Alveolar breath contains volatile organic compounds (VOCs) that cross the blood-air barrier in the pulmonary capillaries.',
    },
    {
      step: 2,
      title: 'Acetone Sensor',
      icon: Microscope,
      badge: 'Gas Chemosensing',
      description: 'Heated semiconductor or electrochemical gas sensor detects acetone gas molecules (CH3COCH3) and alters electrical resistance.',
      detail: 'Surface oxygen ions react with acetone molecules, releasing electrons that modulate the active layer conductivity.',
    },
    {
      step: 3,
      title: 'ESP32 Controller',
      icon: Cpu,
      badge: 'Signal Sampling',
      description: 'ESP32 microcontroller performs 12-bit analog sampling, temperature/humidity compensation, and multi-sample smoothing.',
      detail: 'Dual-core Tensilica processor processes ambient DHT22/BME280 metrics to mitigate relative humidity interference.',
    },
    {
      step: 4,
      title: 'USB Serial Stream',
      icon: Usb,
      badge: '115200 Baud CDC',
      description: 'Hardware USB serial link streams standardized JSON packets directly to the browser via the Web Serial API.',
      detail: 'High-speed, low-latency, driverless local transfer without transmitting private biomedical telemetry to third-party cloud servers.',
    },
    {
      step: 5,
      title: 'Web Dashboard',
      icon: LayoutDashboard,
      badge: 'Telemetry UI',
      description: 'Live sensor oscilloscope plots real-time signal waveforms, baseline drift, and environmental metrics.',
      detail: 'Raw ADC values are strictly separated from calibrated ppm concentrations and certified blood glucose values.',
    },
    {
      step: 6,
      title: 'Experimental Analysis',
      icon: FlaskConical,
      badge: 'Research Model',
      description: 'Correlation algorithms analyze acetone dynamics alongside user-logged clinical blood glucose readings.',
      detail: 'Maintains strict distinction: uncalibrated prototypes display sensor outputs without inventing clinical diagnoses.',
    },
    {
      step: 7,
      title: 'Health Guidance',
      icon: HeartHandshake,
      badge: 'Supportive Care',
      description: 'Evidence-based lifestyle advice, cultural nutrition ideas (including Odisha foods), and structured doctor discussion guides.',
      detail: 'Culturally inclusive guidance focusing on balanced plates, post-meal walking, and safety warnings for hypoglycemia.',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-[#0b101c] to-[#07090e] border border-slate-800 p-8 sm:p-12 lg:p-16">
        {/* Subtle decorative grid overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>ACETOSENSE EXPERIMENTAL PLATFORM</span>
            <span className="text-slate-500">·</span>
            <span>ESP32 WEB SERIAL INTEGRATED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Smart Sensing. Connected Health. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400">
              Experimental Insights.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Real-time acetone breath telemetry, experimental glucose correlation analysis, and personalized evidence-based lifestyle guidance for ESP32 hardware prototypes.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onConnectClick}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-slate-950" />
              <span>Connect ESP32</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Explore Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-5 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Hardware Notice */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
            <span>Baud: 115200 bps</span>
            <span>·</span>
            <span>Sensor: MQ-138 / SGP40</span>
            <span>·</span>
            <span>Web Serial API: Client-Side Only</span>
            <span>·</span>
            <span className="text-cyan-400">Firmware Ready</span>
          </div>
        </div>
      </section>

      {/* Conceptual Illustration: Experimental Prototype Workflow */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              End-to-End Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Experimental Prototype Workflow
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md inline-block">
            Label: Conceptual Illustration
          </div>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            const isActive = activeWorkflowStep === ws.step;
            return (
              <button
                key={ws.step}
                onClick={() => setActiveWorkflowStep(ws.step)}
                className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/50 border-cyan-500/50 text-white shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    0{ws.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-xs font-semibold truncate text-white">{ws.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{ws.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Card */}
        {(() => {
          const current = workflowSteps.find((s) => s.step === activeWorkflowStep)!;
          const CurrentIcon = current.icon;
          return (
            <div className="bg-[#0b0f19] border border-cyan-900/40 rounded-xl p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <CurrentIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Step {current.step}: {current.title}</span>
                      <span className="text-xs font-mono text-cyan-400 font-normal">[{current.badge}]</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Component in the AcetoSense prototype pipeline</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeWorkflowStep <= 1}
                    onClick={() => setActiveWorkflowStep((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={activeWorkflowStep >= workflowSteps.length}
                    onClick={() => setActiveWorkflowStep((prev) => Math.min(workflowSteps.length, prev + 1))}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Process Execution</h4>
                  <p className="text-slate-200 leading-relaxed">{current.description}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Scientific & Engineering Context</h4>
                  <p className="text-slate-300 leading-relaxed">{current.detail}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Molecular & Chemical Foundation */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Molecule & Sensor Graphic Visualizer */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Molecular Target</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                <button
                  onClick={() => setActiveMoleculeView('2d')}
                  className={`px-2 py-0.5 text-xs rounded font-mono ${
                    activeMoleculeView === '2d' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  2D Chemical
                </button>
                <button
                  onClick={() => setActiveMoleculeView('3d')}
                  className={`px-2 py-0.5 text-xs rounded font-mono ${
                    activeMoleculeView === '3d' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  3D Surface
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Acetone (Propan-2-one)</h3>
            <p className="text-xs font-mono text-cyan-300 mb-4">Chemical Formula: CH₃–CO–CH₃ · Molar Mass: 58.08 g/mol</p>

            {/* Dynamic Vector Chemical Diagram */}
            <div className="h-56 bg-[#080c16] rounded-xl border border-slate-800/80 p-4 flex items-center justify-center relative overflow-hidden">
              {/* Particle dust */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-4 left-8 animate-ping" />
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute bottom-6 right-12 animate-pulse" />
              </div>

              {activeMoleculeView === '2d' ? (
                <svg className="w-full h-full max-w-[280px]" viewBox="0 0 280 180" fill="none">
                  {/* Central Carbonyl */}
                  <line x1="140" y1="90" x2="140" y2="40" stroke="#06b6d4" strokeWidth="4" />
                  <line x1="148" y1="90" x2="148" y2="40" stroke="#06b6d4" strokeWidth="4" />
                  <circle cx="144" cy="30" r="14" fill="#f43f5e" />
                  <text x="144" y="35" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">O</text>

                  {/* Central C */}
                  <circle cx="144" cy="95" r="16" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <text x="144" y="100" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold">C</text>

                  {/* Left Bond & CH3 */}
                  <line x1="130" y1="105" x2="70" y2="135" stroke="#64748b" strokeWidth="4" />
                  <circle cx="60" cy="140" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <text x="60" y="145" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">CH₃</text>

                  {/* Right Bond & CH3 */}
                  <line x1="158" y1="105" x2="218" y2="135" stroke="#64748b" strokeWidth="4" />
                  <circle cx="228" cy="140" r="18" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                  <text x="228" y="145" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">CH₃</text>

                  {/* Annotations */}
                  <text x="144" y="170" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">Carbonyl Dipole: μ = 2.88 D</text>
                </svg>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/40 animate-pulse flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-400/30 flex items-center justify-center">
                        <span className="font-mono text-xs text-white font-bold">SnO₂</span>
                      </div>
                    </div>
                    {/* Exhaled particles */}
                    <div className="absolute top-0 right-2 w-3 h-3 rounded-full bg-rose-500" title="Oxygen adions" />
                    <div className="absolute bottom-1 left-2 w-4 h-4 rounded-full bg-teal-400" title="Acetone vapor" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Surface Catalytic Oxidation: <br />
                    CH₃COCH₃ + 8O⁻ → 3CO₂ + 3H₂O + 8e⁻
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            Breath acetone in healthy fasting humans typically ranges between <span className="text-cyan-300 font-mono">0.3 – 1.0 ppm</span>, but can elevate during ketogenic diets, fasting, or uncontrolled ketoacidosis.
          </div>
        </div>

        {/* Scientific Context & Hardware Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <span>Biomarker Biology & Breath Kinetics</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              When the body utilizes fatty acids for energy via β-oxidation, acetoacetate is produced in hepatocytes. Spontaneous decarboxylation produces acetone, a volatile ketone body. Because acetone has a high trans-alveolar partition coefficient (λ ≈ 330 at 37°C), it equilibrates across pulmonary alveolar capillaries into exhaled breath.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="font-mono text-cyan-400 font-semibold block mb-1">Correlation Mechanism</span>
                <span className="text-slate-400">
                  Relative insulin deficiency or impaired cellular glucose uptake elevates lipolysis, driving higher ketone generation and subsequent exhaled breath acetone.
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="font-mono text-cyan-400 font-semibold block mb-1">Time Lag Phenomenon</span>
                <span className="text-slate-400">
                  Breath acetone exhibits a biological latency (often 15–45 minutes) relative to rapid capillary blood glucose fluctuations after high-carbohydrate meals.
                </span>
              </div>
            </div>
          </div>

          {/* Prototype Hardware Stack */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-400" />
              <span>The AcetoSense ESP32 Hardware Stack</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 font-mono text-cyan-400 font-bold">1</div>
                <div>
                  <span className="font-semibold text-white">ESP32-WROOM-32 Microcontroller:</span>
                  <span className="text-slate-400 ml-1">Provides high-resolution 12-bit ADC sampling, hardware UART CDC serial bridge, and onboard multi-sample averaging to dampen electrical noise.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 font-mono text-cyan-400 font-bold">2</div>
                <div>
                  <span className="font-semibold text-white">MQ-138 / SGP40 Gas Sensor:</span>
                  <span className="text-slate-400 ml-1">Heated tin dioxide (SnO2) sensing element tuned for volatile ketones, alcohols, and aromatic hydrocarbons.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 font-mono text-cyan-400 font-bold">3</div>
                <div>
                  <span className="font-semibold text-white">BME280 Environmental Compensator:</span>
                  <span className="text-slate-400 ml-1">Calibrates against humidity swings (water vapor is a known competitor on metal-oxide gas sensor surfaces).</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations and Clinical Safety Section */}
      <section className="bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/60 border border-amber-800/40 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Experimental Disclaimers & Regulatory Notice
            </div>
            <h3 className="text-xl font-bold text-white">
              Prototype Boundaries & Clinical Distinction
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              AcetoSense is an exploratory engineering prototype designed to facilitate sensor calibration, serial connectivity, and educational lifestyle tracking. It is <strong className="text-white">not an approved medical diagnostic device</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-white block mb-1">Cross-Sensitivities</span>
                <span className="text-slate-400">
                  Exhaled ethanol, isoprene, mouthwash alcohols, and fluctuating relative humidity can interfere with semiconductor gas sensor readouts.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-white block mb-1">No Diagnostic Substitution</span>
                <span className="text-slate-400">
                  Acetone estimates must never replace validated capillary fingerstick or venous laboratory plasma glucose tests.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-white block mb-1">Medication Invariance</span>
                <span className="text-slate-400">
                  Never adjust insulin doses, oral hypoglycemic agents, or dietary plans based on uncalibrated experimental sensor telemetry.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigate('connect')}
          className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/70 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
            <Usb className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            Connect ESP32 Serial
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Authorize your USB COM port, configure 115200 baud, and view live incoming JSON telemetry in the built-in terminal.
          </p>
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            Open Connection Hub <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('dashboard')}
          className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/70 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
            Live Telemetry Dashboard
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Inspect raw sensor ADC, ambient temperature, relative humidity, data quality metrics, and log real-time waveforms.
          </p>
          <span className="text-xs font-semibold text-teal-400 flex items-center gap-1">
            Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => onNavigate('lifestyle')}
          className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/70 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
            Food & Lifestyle Guidance
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Explore culturally tailored nutrition guides, authentic Odisha recipes (Dalma, Santula, Mandia), and post-meal habits.
          </p>
          <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
            Browse Nutrition & Habits <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </section>

    </div>
  );
};
