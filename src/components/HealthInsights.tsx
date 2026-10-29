import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Printer,
  ChevronDown,
  Info,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { GlucoseRecord, UserProfile } from '../types';
import { HealthEngine, HealthInsightResult } from '../services/healthEngine';

interface HealthInsightsProps {
  glucoseRecords: GlucoseRecord[];
  userProfile: UserProfile | null;
  onNavigate: (tab: string) => void;
}

export const HealthInsights: React.FC<HealthInsightsProps> = ({
  glucoseRecords,
  userProfile,
  onNavigate,
}) => {
  const [selectedContextFilter, setSelectedContextFilter] = useState<'all' | 'fasting' | 'post_meal'>('all');
  const [customQuestions, setCustomQuestions] = useState<string[]>([
    'Are my current fasting readings aligned with my target individualized range?',
    'How do my postprandial values correlate with the carbohydrate proportion in my regular meals?',
    'Should we schedule a formal laboratory fasting plasma glucose (FPG) or HbA1c test?',
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');

  // Evaluate clinical status based on strict rules A-F
  const insight: HealthInsightResult = HealthEngine.evaluateHealthStatus(
    glucoseRecords,
    userProfile
  );

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    setCustomQuestions([...customQuestions, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Clinical Context Engine
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">ADA 2026 Reference Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Health Insights and Next Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Contextual evaluation of your validated glucose measurements, historical trends, and structured clinical discussion guides.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 transition-all cursor-pointer no-print self-start md:self-auto"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print Clinical Summary</span>
        </button>
      </div>

      {/* Primary Dynamic Evaluation Card (Messages A through F) */}
      <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden ${
        insight.urgency === 'emergency'
          ? 'bg-rose-950/40 border-rose-600/70'
          : insight.urgency === 'attention'
          ? 'bg-amber-950/30 border-amber-600/60'
          : 'bg-slate-900/70 border-cyan-800/50'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            insight.urgency === 'emergency'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : insight.urgency === 'attention'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
          }`}>
            {insight.urgency === 'emergency' ? (
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            ) : insight.urgency === 'attention' ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Rule Evaluation Category [{insight.messageType}]
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                insight.urgency === 'emergency'
                  ? 'bg-rose-500/30 text-rose-200'
                  : insight.urgency === 'attention'
                  ? 'bg-amber-500/30 text-amber-200'
                  : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {insight.urgency}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">
              {insight.headline}
            </h3>

            {/* Mandated exact message prose */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal bg-black/20 p-4 rounded-xl border border-white/5">
              "{insight.body}"
            </p>

            {/* Positive encouragement / context */}
            {insight.encouragement && (
              <div className="flex items-start gap-2 text-xs text-cyan-300/90 pt-1">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <p>{insight.encouragement}</p>
              </div>
            )}

            <div className="pt-2 text-[11px] text-slate-400 font-mono">
              Disclaimer: {insight.clinicalDisclaimer}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Reference Standards Section (ADA & WHO 2026) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Standard Laboratory & Clinical Reference Thresholds</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standard diagnostic pathways for venous plasma glucose and validated capillary measurements.
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Source: ADA Standards of Care (Updated 2026)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Test Category</th>
                <th className="py-3 px-4">Normal / Reference</th>
                <th className="py-3 px-4">Impaired / Prediabetes</th>
                <th className="py-3 px-4">Diabetes Threshold (Repeat Required)</th>
                <th className="py-3 px-4">Clinical Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-white">
                  Fasting Plasma Glucose (FPG)
                </td>
                <td className="py-3 px-4 text-emerald-400">&lt; 100 mg/dL (&lt; 5.6 mmol/L)</td>
                <td className="py-3 px-4 text-amber-300">100 – 125 mg/dL (5.6–6.9 mmol/L)</td>
                <td className="py-3 px-4 text-rose-400">≥ 126 mg/dL (≥ 7.0 mmol/L)</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">Requires at least 8 hours no caloric intake</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-white">
                  2-Hour Postprandial / OGTT (75g)
                </td>
                <td className="py-3 px-4 text-emerald-400">&lt; 140 mg/dL (&lt; 7.8 mmol/L)</td>
                <td className="py-3 px-4 text-amber-300">140 – 199 mg/dL (7.8–11.0 mmol/L)</td>
                <td className="py-3 px-4 text-rose-400">≥ 200 mg/dL (≥ 11.1 mmol/L)</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">Tested 2h after oral 75g anhydrous glucose</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-white">
                  Glycated Hemoglobin (HbA1c)
                </td>
                <td className="py-3 px-4 text-emerald-400">&lt; 5.7% (&lt; 39 mmol/mol)</td>
                <td className="py-3 px-4 text-amber-300">5.7% – 6.4% (39–47 mmol/mol)</td>
                <td className="py-3 px-4 text-rose-400">≥ 6.5% (≥ 48 mmol/mol)</td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">Reflects 2-3 month glycemic average</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-white">
                  Exhaled Breath Acetone (EBA)
                </td>
                <td className="py-3 px-4 text-cyan-300">0.3 – 1.0 ppm (Basal)</td>
                <td className="py-3 px-4 text-slate-400">1.0 – 2.5 ppm (Mild Ketosis)</td>
                <td className="py-3 px-4 text-slate-400">&gt; 3.0 ppm (Elevated Ketogenesis)</td>
                <td className="py-3 px-4 text-amber-300 text-[11px]">Experimental biomarker · Not a direct diagnostic substitute</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Clinical Distinction Notice:</strong> Laboratory fasting reference ranges cannot be applied to after-meal readings without accounting for digestive absorption. Similarly, unvalidated acetone breath sensor readings are non-diagnostic and must never be used alone to assign a chronic disease diagnosis or prediabetes status.
        </div>
      </div>

      {/* Emergency Red Flags & Critical Safety Protocol */}
      <div className="bg-gradient-to-r from-rose-950/40 to-slate-900/60 border border-rose-800/60 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              Critical Safety Protocol & Emergency Red Flags
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you or someone in your care experiences any of the following acute symptoms, seek immediate emergency medical assistance. Do not wait for website updates or prototype re-testing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-2">
            <span className="font-bold text-rose-400 block font-mono uppercase">
              Suspected Severe Hypoglycemia (&lt; 54 mg/dL)
            </span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Profuse cold sweating, trembling, shakiness</li>
              <li>Sudden disorientation, confusion, slurred speech</li>
              <li>Dizziness, blurred vision, loss of consciousness</li>
              <li><strong className="text-white">Action:</strong> Administer 15g rapid carbohydrates if conscious; call emergency services (112 / 911 / 108) immediately.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-2">
            <span className="font-bold text-rose-400 block font-mono uppercase">
              Suspected Diabetic Ketoacidosis (DKA) / Hyperglycemic Crisis
            </span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Deep, rapid, labored breathing (Kussmaul breathing)</li>
              <li>Persistent vomiting, severe abdominal pain</li>
              <li>Heavy fruity/sweet acetone breath odor with high glucose</li>
              <li><strong className="text-white">Action:</strong> Immediate hospital emergency department evaluation required.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Doctor Discussion Guide & Printable Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-400" />
              <span>Doctor Discussion Guide & Appointment Checklist</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured questions to bring to your next healthcare visit alongside your recorded logs.
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-400">
            {customQuestions.length} Questions Prepared
          </span>
        </div>

        {/* Question List */}
        <div className="space-y-2">
          {customQuestions.map((q, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-400 shrink-0">
                  {idx + 1}
                </span>
                <span>{q}</span>
              </div>
              <button
                onClick={() => handleRemoveQuestion(idx)}
                className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1"
                title="Remove question"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add Question Form */}
        <form onSubmit={handleAddQuestion} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newQuestionInput}
            onChange={(e) => setNewQuestionInput(e.target.value)}
            placeholder="Add a personalized question for your clinician..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            + Add Question
          </button>
        </form>
      </div>

    </div>
  );
};
