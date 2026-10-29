import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Users,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Heart,
  Scale
} from 'lucide-react';
import { UserProfile, GenderType, DiabetesStatusType, DietaryPreference } from '../types';

export const DEFAULT_PATIENTS: UserProfile[] = [
  {
    fullName: 'Arpita Sahu',
    age: 32,
    gender: 'female',
    weightKg: 58.5,
    heightCm: 162,
    diabetesStatus: 'not_sure',
    diabetesType: 'none',
    defaultMeasurementContext: 'fasting',
    dietaryPreference: 'odisha_traditional',
    allergies: 'None',
    consentGiven: true,
    targetGlucoseMin: 70,
    targetGlucoseMax: 140,
    preferredUnit: 'mg/dL',
  },
  {
    fullName: 'Ramesh Mohanty',
    age: 48,
    gender: 'male',
    weightKg: 74.0,
    heightCm: 172,
    diabetesStatus: 'yes',
    diabetesType: 'type_2',
    defaultMeasurementContext: '2h_post_meal',
    dietaryPreference: 'odisha_traditional',
    allergies: 'None',
    consentGiven: true,
    targetGlucoseMin: 80,
    targetGlucoseMax: 160,
    preferredUnit: 'mg/dL',
  },
  {
    fullName: 'Priya Dash',
    age: 26,
    gender: 'female',
    weightKg: 54.0,
    heightCm: 158,
    diabetesStatus: 'no',
    diabetesType: 'none',
    defaultMeasurementContext: 'fasting',
    dietaryPreference: 'vegetarian',
    allergies: 'Peanuts',
    consentGiven: true,
    targetGlucoseMin: 70,
    targetGlucoseMax: 120,
    preferredUnit: 'mg/dL',
  },
];

interface PatientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (patient: UserProfile) => void;
  activePatient: UserProfile | null;
}

export const PatientSelectorModal: React.FC<PatientSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPatient,
  activePatient,
}) => {
  const [patientList, setPatientList] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('acetosense_patients_list');
      return saved ? JSON.parse(saved) : DEFAULT_PATIENTS;
    } catch {
      return DEFAULT_PATIENTS;
    }
  });

  const [mode, setMode] = useState<'select' | 'create'>('select');

  // Form for new patient
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>(35);
  const [newGender, setNewGender] = useState<GenderType>('prefer_not_to_say');
  const [newStatus, setNewStatus] = useState<DiabetesStatusType>('not_sure');
  const [newContext, setNewContext] = useState<any>('fasting');
  const [newDiet, setNewDiet] = useState<DietaryPreference>('odisha_traditional');

  if (!isOpen) return null;

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newPatient: UserProfile = {
      fullName: newName.trim(),
      age: typeof newAge === 'number' ? newAge : null,
      gender: newGender,
      weightKg: 65,
      heightCm: 168,
      diabetesStatus: newStatus,
      diabetesType: newStatus === 'yes' ? 'type_2' : 'none',
      defaultMeasurementContext: newContext,
      dietaryPreference: newDiet,
      allergies: 'None reported',
      consentGiven: true,
      targetGlucoseMin: 70,
      targetGlucoseMax: 140,
      preferredUnit: 'mg/dL',
    };

    const updatedList = [newPatient, ...patientList];
    setPatientList(updatedList);
    try {
      localStorage.setItem('acetosense_patients_list', JSON.stringify(updatedList));
    } catch {}

    onSelectPatient(newPatient);
    onClose();
  };

  const handlePickExisting = (patient: UserProfile) => {
    onSelectPatient(patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0b0f19] border border-cyan-800/60 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Select Patient Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Identify patient to initialize OLED / LCD monitor and logging
              </p>
            </div>
          </div>

          {activePatient && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded border border-slate-800"
            >
              Continue as {activePatient.fullName.split(' ')[0]} ✕
            </button>
          )}
        </div>

        {/* Tab switcher: Existing History vs New Patient */}
        <div className="flex items-center gap-2 my-5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'select'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Patients ({patientList.length})</span>
          </button>
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'create'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Patient</span>
          </button>
        </div>

        {/* Mode 1: Select Recent Patient */}
        {mode === 'select' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {patientList.map((p, idx) => {
              const isCurrent = activePatient?.fullName === p.fullName;
              return (
                <div
                  key={idx}
                  onClick={() => handlePickExisting(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/70 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{p.fullName}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-900/60 px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                        <span>{p.age ? `${p.age} yrs` : 'Age N/A'}</span>
                        <span>·</span>
                        <span className="capitalize">{p.defaultMeasurementContext.replace('_', ' ')}</span>
                        <span>·</span>
                        <span className="text-teal-400 capitalize">{p.dietaryPreference.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 group-hover:bg-cyan-400 group-hover:text-slate-950 text-slate-300 transition-all flex items-center gap-1">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Mode 2: Quick Create Patient Form */}
        {mode === 'create' && (
          <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase font-mono text-slate-400 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh Mohanty"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Routine Context
                </label>
                <select
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="fasting">Morning Fasting</option>
                  <option value="2h_post_meal">2h After Meal</option>
                  <option value="before_meal">Pre-Meal</option>
                  <option value="random">Random</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Diabetes Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="not_sure">Not Sure / Unconfirmed</option>
                  <option value="yes">Diagnosed Diabetes</option>
                  <option value="no">No Diabetes</option>
                </select>
              </div>

              <div>
                <label className="block uppercase font-mono text-slate-400 mb-1">
                  Dietary Background
                </label>
                <select
                  value={newDiet}
                  onChange={(e) => setNewDiet(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="odisha_traditional">Odisha Traditional (Dalma/Santula)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="all">Standard / All</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode('select')}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold rounded-xl shadow-md"
              >
                Save & Start Monitoring
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </div>
  );
};
