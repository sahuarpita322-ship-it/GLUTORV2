import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Download,
  Trash2,
  Printer,
  ShieldCheck,
  FlaskConical,
  Edit3,
  Calendar,
  AlertCircle,
  Search,
  Check
} from 'lucide-react';
import { GlucoseRecord, MeasurementContext, MeasurementSource } from '../types';

interface MeasurementHistoryProps {
  records: GlucoseRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onExportCsv: () => void;
}

export const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
  onUpdateNotes,
  onExportCsv,
}) => {
  const [contextFilter, setContextFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Filter records
  const filtered = records.filter((r) => {
    if (contextFilter !== 'all' && r.context !== contextFilter) return false;
    if (sourceFilter === 'validated' && r.source !== 'independent_meter' && r.source !== 'manual_entry') return false;
    if (sourceFilter === 'experimental' && r.source !== 'experimental_model') return false;
    if (sourceFilter === 'simulated' && !r.isSimulated) return false;
    if (sourceFilter === 'real_only' && r.isSimulated) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNotes = r.notes?.toLowerCase().includes(q);
      const matchContext = r.context.toLowerCase().includes(q);
      const matchVal = String(r.value).includes(q);
      return matchNotes || matchContext || matchVal;
    }
    return true;
  });

  const handleStartEdit = (r: GlucoseRecord) => {
    setEditingId(r.id);
    setEditNoteText(r.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    onUpdateNotes(id, editNoteText);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Audit Trail & Records
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">Verified Health Storage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Measurement History & Clinical Export
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Detailed log of certified blood glucose checks, paired breath acetone telemetry, and observational notes.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 no-print self-start md:self-auto">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onExportCsv}
            disabled={records.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {records.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all stored measurement records? This action is permanent.')) {
                  onClearAll();
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Context Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-mono">Context:</span>
            <select
              value={contextFilter}
              onChange={(e) => setContextFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Contexts</option>
              <option value="fasting">Fasting</option>
              <option value="before_meal">Before Meal</option>
              <option value="1h_post_meal">1h Post-Meal</option>
              <option value="2h_post_meal">2h Post-Meal</option>
              <option value="bedtime">Bedtime</option>
              <option value="random">Random</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-mono">Source Type:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Records</option>
              <option value="validated">Certified Independent Meter</option>
              <option value="experimental">Experimental Models</option>
              <option value="real_only">Physical Hardware Only</option>
              <option value="simulated">Simulated Data Only</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, values..."
            className="w-full md:w-56 bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg print-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Source Category</th>
                <th className="py-3 px-4">Glucose Value</th>
                <th className="py-3 px-4">Context</th>
                <th className="py-3 px-4">Correlated Acetone</th>
                <th className="py-3 px-4">Clinical Notes</th>
                <th className="py-3 px-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((record) => {
                const isEditing = editingId === record.id;
                return (
                  <tr key={record.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 whitespace-nowrap tabular-nums text-slate-300">
                      <div>{new Date(record.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-500">{new Date(record.timestamp).toLocaleTimeString()}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {record.source === 'independent_meter' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Independent Meter</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
                            <FlaskConical className="w-3 h-3" />
                            <span>Experimental Estimate</span>
                          </span>
                        )}
                        {record.isSimulated && (
                          <span className="text-[9px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1 rounded">
                            SIM
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-white text-sm tabular-nums">
                        {record.value}
                      </span>
                      <span className="text-slate-500 ml-1 text-xs">
                        {record.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap capitalize text-slate-300">
                      {record.context.replace(/_/g, ' ')}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {record.correlatedAcetoneRaw ? (
                        <div>
                          <span className="text-cyan-300 font-semibold">{record.correlatedAcetoneRaw} ADC</span>
                          {record.calibratedAcetonePpm && (
                            <span className="text-slate-500 block text-[10px]">~{record.calibratedAcetonePpm} ppm</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600">Not recorded</span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 w-full"
                          />
                          <button
                            onClick={() => handleSaveEdit(record.id)}
                            className="p-1 text-cyan-400 hover:text-cyan-300"
                            title="Save note"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEdit(record)}
                          className="cursor-pointer hover:text-white truncate"
                          title="Click to edit note"
                        >
                          {record.notes ? (
                            <span>{record.notes}</span>
                          ) : (
                            <span className="text-slate-600 italic">+ Add note</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          title="Edit note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(record.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span>No measurement records match the current filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
