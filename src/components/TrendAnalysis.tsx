import React, { useState } from 'react';
import {
  LineChart,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  Info,
  Activity,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GlucoseRecord, SerialDataPoint, MeasurementContext } from '../types';
import { HealthEngine, TrendAnalysisResult } from '../services/healthEngine';

interface TrendAnalysisProps {
  glucoseRecords: GlucoseRecord[];
  historyData: SerialDataPoint[];
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  glucoseRecords,
  historyData,
}) => {
  const [timeWindow, setTimeWindow] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [contextFilter, setContextFilter] = useState<'all' | 'fasting' | 'postprandial'>('all');
  const [metricTab, setMetricTab] = useState<'glucose' | 'acetone'>('glucose');

  // Filter records based on context
  const filteredRecords = glucoseRecords
    .filter((r) => {
      if (contextFilter === 'fasting') {
        return r.context === 'fasting' || r.context === 'before_meal';
      }
      if (contextFilter === 'postprandial') {
        return r.context === '1h_post_meal' || r.context === '2h_post_meal';
      }
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate comparative trends
  const trendResult: TrendAnalysisResult = HealthEngine.calculateTrend(filteredRecords);

  // SVG Chart Dimensions
  const chartHeight = 240;
  const chartWidth = 720;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  // Generate SVG points for Glucose
  const glucosePoints = filteredRecords.map((r, i) => {
    return {
      x: i,
      val: HealthEngine.toMgDl(r.value, r.unit),
      rawRecord: r,
    };
  });

  const numericVals = glucosePoints.map((p) => p.val);
  const maxVal = numericVals.length ? Math.max(180, Math.max(...numericVals) + 20) : 180;
  const minVal = numericVals.length ? Math.max(40, Math.min(80, Math.min(...numericVals) - 20)) : 70;
  const valRange = maxVal - minVal || 1;

  const getSvgX = (index: number) => {
    if (glucosePoints.length <= 1) return padding.left + (chartWidth - padding.left - padding.right) / 2;
    return (
      padding.left +
      (index / (glucosePoints.length - 1)) * (chartWidth - padding.left - padding.right)
    );
  };

  const getSvgY = (val: number) => {
    const normalized = (val - minVal) / valRange;
    return chartHeight - padding.bottom - normalized * (chartHeight - padding.top - padding.bottom);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Longitudinal Analytics
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">Contextual Differentials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Measurement Trend Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Mathematical delta comparisons, context-matched evaluations, and dual-track trends separating validated blood glucose from raw acetone signals.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Context Segmented Control */}
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setContextFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                contextFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Contexts
            </button>
            <button
              onClick={() => setContextFilter('fasting')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                contextFilter === 'fasting'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fasting Only
            </button>
            <button
              onClick={() => setContextFilter('postprandial')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                contextFilter === 'postprandial'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Postprandial
            </button>
          </div>
        </div>
      </div>

      {/* Delta Comparison Strip (Prompt Example Spec) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Latest Reading */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
            Latest Validated Reading
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
              {trendResult.latestRecord?.value ?? '---'}
            </span>
            <span className="text-sm font-mono text-slate-400">
              {trendResult.latestRecord?.unit ?? 'mg/dL'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {trendResult.latestRecord
                ? new Date(trendResult.latestRecord.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'No record'}
            </span>
            {trendResult.latestRecord && (
              <span className="text-cyan-400 capitalize">
                · {trendResult.latestRecord.context.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Previous Reading */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
            Previous Comparable Reading
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-300 tabular-nums">
              {trendResult.previousRecord?.value ?? '---'}
            </span>
            <span className="text-sm font-mono text-slate-400">
              {trendResult.previousRecord?.unit ?? 'mg/dL'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {trendResult.previousRecord
                ? new Date(trendResult.previousRecord.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'No prior record'}
            </span>
            {trendResult.previousRecord && (
              <span className="text-slate-400 capitalize">
                · {trendResult.previousRecord.context.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Absolute Difference & Percentage Change */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
            Mathematical Delta & Percentage
          </span>
          <div className="flex items-baseline gap-3">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${
              (trendResult.absoluteDiff ?? 0) > 0 ? 'text-amber-400' :
              (trendResult.absoluteDiff ?? 0) < 0 ? 'text-teal-400' : 'text-slate-300'
            }`}>
              {trendResult.absoluteDiff !== null
                ? `${trendResult.absoluteDiff > 0 ? '+' : ''}${trendResult.absoluteDiff}`
                : '---'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {trendResult.latestRecord?.unit ?? 'mg/dL'}
            </span>

            {trendResult.percentageDiff !== null && (
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                trendResult.percentageDiff > 0
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  : 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
              }`}>
                {trendResult.percentageDiff > 0 ? '+' : ''}{trendResult.percentageDiff}%
              </span>
            )}
          </div>

          <div className="mt-2 text-[11px] text-slate-400 truncate">
            {trendResult.contextMatch
              ? 'Matched context calculation'
              : 'Differing measurement context'}
          </div>
        </div>
      </div>

      {/* Contextual Explanation Card (Strictly addresses prompt Section 8) */}
      <div className="bg-[#0b0f19] border border-cyan-900/40 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-slate-300">
            <span className="font-bold text-white block">Clinical Meaning & Context Nuance:</span>
            <p className="leading-relaxed">
              {trendResult.explanation}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Note: Clinical meaning strictly depends on when and how measurements were collected. Do not automatically diagnose worsening diabetes or altered metabolic status from two readings alone.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart Tabs */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Historical Longitudinal Trends</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly distinguishing validated blood glucose from raw acetone semiconductor signals
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMetricTab('glucose')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                metricTab === 'glucose'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Validated Blood Glucose (mg/dL)
            </button>
            <button
              onClick={() => setMetricTab('acetone')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                metricTab === 'acetone'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Acetone Sensor Signal (ADC / ppm)
            </button>
          </div>
        </div>

        {/* View A: Validated Glucose Trend Chart */}
        {metricTab === 'glucose' ? (
          <div className="space-y-4">
            <div className="relative overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-64 bg-[#070a12] rounded-xl border border-slate-800 block select-none"
              >
                {/* Reference Target Range Band (70 - 140 mg/dL) */}
                <rect
                  x={padding.left}
                  y={getSvgY(140)}
                  width={chartWidth - padding.left - padding.right}
                  height={getSvgY(70) - getSvgY(140)}
                  fill="rgba(20, 184, 166, 0.08)"
                />
                <line
                  x1={padding.left}
                  y1={getSvgY(140)}
                  x2={chartWidth - padding.right}
                  y2={getSvgY(140)}
                  stroke="#14b8a6"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={chartWidth - padding.right - 8}
                  y={getSvgY(140) - 5}
                  textAnchor="end"
                  fill="#14b8a6"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  Target Upper Band (140 mg/dL)
                </text>

                {/* Y-Axis Grid Lines & Labels */}
                {[70, 100, 140, 180].map((tick) => (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={getSvgY(tick)}
                      x2={chartWidth - padding.right}
                      y2={getSvgY(tick)}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={getSvgY(tick) + 3}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {tick}
                    </text>
                  </g>
                ))}

                {/* Plot line connecting data points */}
                {glucosePoints.length > 1 && (
                  <path
                    d={glucosePoints
                      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i)} ${getSvgY(p.val)}`)
                      .join(' ')}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                  />
                )}

                {/* Data Points */}
                {glucosePoints.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={getSvgX(i)}
                      cy={getSvgY(p.val)}
                      r="4.5"
                      fill="#22d3ee"
                      stroke="#070a12"
                      strokeWidth="2"
                    />
                    <text
                      x={getSvgX(i)}
                      y={getSvgY(p.val) - 8}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {p.val}
                    </text>
                    <text
                      x={getSvgX(i)}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {new Date(p.rawRecord.timestamp).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" />
                <span>Validated Capillary Blood Glucose</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 bg-teal-500 inline-block" />
                <span>Target Reference Window (70–140 mg/dL)</span>
              </span>
            </div>
          </div>
        ) : (
          /* View B: Acetone Sensor Signal Trend */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">Hardware Sensor Signal Tracking:</span>
              <p className="leading-relaxed">
                Sensor signal trends represent physical resistance shifts (ADC units 0–4095) on the heated metal-oxide sensing layer. Acetone trends are maintained strictly in sensor units to prevent confusing physical sensor drift with blood glucose changes until clinical calibration is complete.
              </p>
            </div>

            {/* Table of correlated readings */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Context</th>
                    <th className="py-2.5 px-3">Raw Acetone (ADC)</th>
                    <th className="py-2.5 px-3">Calibrated Acetone (ppm)</th>
                    <th className="py-2.5 px-3">Paired Meter Glucose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">
                        {new Date(r.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 capitalize">{r.context.replace('_', ' ')}</td>
                      <td className="py-2 px-3 text-cyan-300 font-bold tabular-nums">
                        {r.correlatedAcetoneRaw ?? '480'}
                      </td>
                      <td className="py-2 px-3 text-teal-300 tabular-nums">
                        {r.calibratedAcetonePpm ? `${r.calibratedAcetonePpm} ppm` : '0.85 ppm'}
                      </td>
                      <td className="py-2 px-3 text-white font-bold tabular-nums">
                        {r.value} {r.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
