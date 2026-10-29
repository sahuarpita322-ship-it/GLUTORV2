import React from 'react';
import {
  HelpCircle,
  Wind,
  Cpu,
  FlaskConical,
  Activity,
  Layers,
  Thermometer,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (tab: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Biomedical Engineering & Principles
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs font-mono text-slate-400">Scientific Whitepaper Summary</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          How AcetoSense Works: From Breath Exhalation to Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive scientific explanation of trans-alveolar breath acetone diffusion, semiconductor gas sensor mechanics, ESP32 embedded processing, and experimental machine learning estimation boundaries.
        </p>
      </div>

      {/* Section 1: Breath Acetone Biomarker Biology */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1. The Biological Pathway of Exhaled Acetone</h3>
            <span className="text-xs text-slate-400 font-mono">Hepatic Lipolysis & Trans-Alveolar Diffusion</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div>
            <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono mb-2">Metabolic Generation</h4>
            <p>
              When human cells experience relative insulin insufficiency or when carbohydrate availability drops, hepatocytes accelerate β-oxidation of free fatty acids. This process produces acetoacetyl-CoA, which converts into acetoacetate. A portion of acetoacetate undergoes spontaneous enzymatic decarboxylation into <strong className="text-white">acetone (CH₃COCH₃)</strong>.
            </p>
            <p className="mt-2">
              Unlike beta-hydroxybutyrate and acetoacetate, acetone has a small molecular weight (58.08 g/mol) and a high vapor pressure, making it inherently volatile at normal body temperature (37°C).
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-teal-300 uppercase font-mono mb-2">Alveolar Capillary Transfer</h4>
            <p>
              As blood flows through the pulmonary microcirculation, dissolved volatile acetone equilibrates across the ultra-thin (0.2–0.5 μm) blood-air alveolar membrane into alveolar air according to Henry's Law.
            </p>
            <p className="mt-2">
              The blood-to-air partition coefficient (λ_b:a) for acetone is approximately <strong className="text-white">330 at 37°C</strong>. In healthy individuals, baseline fasting exhaled acetone concentrations range between <strong className="text-cyan-300 font-mono">0.3 and 1.0 ppm</strong> (parts per million), but can rise during ketogenic fasting or untreated diabetic ketoacidosis.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Sensor Stack & Physics */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Gas Sensor Chemosensing Mechanics</h3>
            <span className="text-xs text-slate-400 font-mono">Metal-Oxide Semiconductor (MOS) Tin Dioxide (SnO₂)</span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <p>
            The prototype utilizes an analytical metal-oxide semiconductor gas sensor (such as the <strong className="text-white">MQ-138</strong> or micro-machined <strong className="text-white">Sensirion SGP40</strong>). The sensing element features a micro-ceramic substrate coated with nano-crystalline tin dioxide (SnO₂) operating at an elevated heater temperature (~250°C–350°C).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-cyan-400 block font-bold mb-1">State A: Ambient Air</span>
              <p className="text-[11px] text-slate-400">
                Atmospheric oxygen molecules adsorb onto the SnO₂ surface, trapping conduction-band electrons: <br />
                <code className="text-slate-300">O₂(gas) + 2e⁻ → 2O⁻(ads)</code>. <br />
                This creates a broad potential barrier and high baseline electrical resistance ($R_0$).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-teal-400 block font-bold mb-1">State B: Exhaled Acetone</span>
              <p className="text-[11px] text-slate-400">
                Reducing acetone vapors react with surface oxygen adions: <br />
                <code className="text-slate-300">CH₃COCH₃ + 8O⁻ → 3CO₂ + 3H₂O + 8e⁻</code>. <br />
                Electrons are injected back into the conduction band, abruptly lowering sensor resistance ($R_s$).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-sky-400 block font-bold mb-1">State C: ESP32 Sampling</span>
              <p className="text-[11px] text-slate-400">
                A voltage divider produces an analog voltage proportional to $R_0/R_s$. The ESP32's 12-bit SAR ADC quantizes this signal from 0 to 4095 counts at high oversampling frequency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Environmental Compensation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Environmental Moisture & Temperature Compensation</h3>
            <span className="text-xs text-slate-400 font-mono">BME280 / DHT22 Real-Time Filtering</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Exhaled human breath is saturated with water vapor (~95% relative humidity at 34°C oral exit). Water molecules competitively adsorb onto metal-oxide gas sensor active sites, introducing significant false-positive conductance drift.
        </p>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <span className="font-bold text-white block mb-1">AcetoSense Mitigation Strategy:</span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li><strong className="text-slate-200">Physical Condensation Trap:</strong> Breath sampling tube incorporates a desiccant silica membrane or mechanical baffle to strip droplet condensation.</li>
            <li><strong className="text-slate-200">Algorithmic Correction Matrix:</strong> Ambient temperature and %RH from the BME280 sensor dynamically correct the measured $R_s/R_0$ ratio using empirically derived polynomial temperature-humidity coefficients.</li>
          </ul>
        </div>
      </div>

      {/* Section 4: Experimental Glucose Estimation Boundaries */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-slate-900/60 border border-cyan-800/40 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. Experimental Glucose Estimation: Promise & Boundaries</h3>
            <span className="text-xs text-slate-400 font-mono">Current State of Machine Learning Models</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Academic literature has demonstrated statistically significant correlations between exhaled breath acetone and circulating capillary blood glucose under controlled fasting protocols. However, translating this into an everyday, non-invasive glucose monitor requires overcoming three key physiological barriers:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-white block mb-1">1. Kinetic Latency</span>
              <p className="text-slate-400">
                Breath acetone reflects hepatic lipid flux, which lags rapid postprandial glucose swings by 15–45 minutes.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-white block mb-1">2. Cross-Interference</span>
              <p className="text-slate-400">
                Exogenous alcohols, dietary ketosis, intense exercise, and oral microflora produce volatile hydrocarbons that challenge single-sensor specificity.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-bold text-white block mb-1">3. Personal Calibration</span>
              <p className="text-slate-400">
                Transfer models require individualized baseline calibration against paired capillary fingerstick tests to establish accurate scaling factors.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Explore Dashboard Telemetry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
