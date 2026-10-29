import React from 'react';
import {
  Info,
  ShieldCheck,
  BookOpen,
  Lock,
  GitBranch,
  Heart,
  ExternalLink,
  Code2,
  FileCheck
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Open Biomedical Prototype
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs font-mono text-slate-400">Version 1.0.4-research</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          About AcetoSense
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          An open-source scientific platform connecting micro-analytical breath acetone sensors to modern web telemetry, contextual trend analysis, and culturally grounded metabolic wellness guidance.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Local-First Privacy Architecture</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your physiological telemetry never leaves your device. The browser Web Serial API interfaces directly with the ESP32 USB controller in client-side memory. No cloud databases or tracking beacons store your personal health data without your explicit export.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Ethical Clinical Separation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We adhere strictly to responsible medical communication standards: experimental sensor readings are never conflated with certified clinical blood glucose tests, and demographic traits are never used alone to diagnose disease.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Culturally Rooted Wellness</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Health advice respects diverse nutritional heritage, featuring traditional Odisha cuisine (Dalma, Santula, Mandia ruti, Kosala saga) with emphasis on proportion, fiber, and post-meal habits rather than restrictive taboos.
          </p>
        </div>
      </div>

      {/* Peer-Reviewed Scientific References */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Scientific Literature & Clinical Citations</h3>
            <span className="text-xs text-slate-400">Grounding empirical data and reference thresholds</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-0.5">[1] American Diabetes Association (ADA)</span>
            <span className="text-slate-300">"Standards of Care in Diabetes — 2026." Diabetes Care, Vol. 49, Suppl. 1. Reference diagnostic thresholds for Fasting Plasma Glucose (FPG), 2-hour OGTT, and HbA1c.</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-teal-400 font-bold block mb-0.5">[2] World Health Organization (WHO)</span>
            <span className="text-slate-300">"Definition and diagnosis of diabetes mellitus and intermediate hyperglycaemia." Technical Report Series, WHO Guidelines Approved by the Guidelines Review Committee.</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-sky-400 font-bold block mb-0.5">[3] Saasa et al.</span>
            <span className="text-slate-300">"Breath Acetone as a Biomarker for Diabetes: A Review of Breath Gas Chromatography and Chemoresistive Sensing." IEEE Reviews in Biomedical Engineering, 11:287–300.</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-indigo-400 font-bold block mb-0.5">[4] Anderson, J. C.</span>
            <span className="text-slate-300">"Measuring Breath Acetone for Monitoring Fat Loss and Ketosis: Review of Partition Kinetics." Obesity, 23(12):2327–2334.</span>
          </div>
        </div>
      </div>

      {/* Hardware Bill of Materials & Developer Notes */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Code2 className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-lg font-bold text-white">Open Hardware Prototype Specifications</h3>
            <span className="text-xs text-slate-400">Components tested with the AcetoSense Web Serial protocol</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MICROCONTROLLER</span>
            <span className="text-white font-bold">ESP32 DevKit V1</span>
            <span className="text-slate-400 block text-[11px] mt-1">Tensilica Xtensa 32-bit</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">GAS SENSOR</span>
            <span className="text-white font-bold">MQ-138 / SGP40</span>
            <span className="text-slate-400 block text-[11px] mt-1">SnO₂ chemoresistor</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ENVIRONMENTAL</span>
            <span className="text-white font-bold">BME280 / DHT22</span>
            <span className="text-slate-400 block text-[11px] mt-1">Temp + RH compensation</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">INTERFACE</span>
            <span className="text-white font-bold">Web Serial API</span>
            <span className="text-slate-400 block text-[11px] mt-1">115200 Baud CDC stream</span>
          </div>
        </div>
      </div>
    </div>
  );
};
