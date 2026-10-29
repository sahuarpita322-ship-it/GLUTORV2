import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Save,
  Trash2,
  AlertTriangle,
  Info,
  Check,
  Scale,
  Ruler,
  Calendar,
  Lock
} from 'lucide-react';
import { UserProfile, GenderType, DiabetesStatusType, DiabetesType, DietaryPreference } from '../types';

interface UserProfilePageProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetData: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  profile,
  onSaveProfile,
  onResetData,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [consentError, setConsentError] = useState(false);

  // Compute BMI dynamically if weight and height are present
  const calculateBmi = () => {
    if (!formData.weightKg || !formData.heightCm || formData.heightCm <= 0) return null;
    const heightM = formData.heightCm / 100;
    const bmi = formData.weightKg / (heightM * heightM);
    return Number(bmi.toFixed(1));
  };

  const bmi = calculateBmi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Personal Health Profile
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400">Encrypted Local Storage</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            User Registration & Health Context
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Configure your personal biometric parameters, baseline clinical context, and dietary preferences to tailor educational recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your profile and reset all health telemetry? This cannot be undone.')) {
                onResetData();
              }
            }}
            className="px-3.5 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Health Account</span>
          </button>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Policy Notice */}
      <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-4 sm:p-5 flex items-start gap-3 text-xs text-cyan-200">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">
            Ethical Health Information Policy:
          </span>
          <p className="leading-relaxed">
            <strong className="text-white">Demographic information alone is never used to diagnose diabetes.</strong> Age, weight, height, and gender are utilized exclusively to calculate physiological reference indices (such as BMI) and to customize educational lifestyle suggestions. Clinical diabetes diagnosis requires standardized laboratory blood testing by a qualified physician.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Demographics */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Personal Demographics & Biometrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age ?? ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Gender Identity
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-Binary</option>
                <option value="prefer_not_to_say">Prefer Not to Say</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="350"
                  value={formData.weightKg ?? ''}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-500 font-mono text-[11px]">kg</span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Height (Optional, cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={formData.heightCm ?? ''}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value ? parseFloat(e.target.value) : null })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <span className="absolute right-3 top-2 text-slate-500 font-mono text-[11px]">cm</span>
              </div>
            </div>

            {/* Calculated BMI Badge */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col justify-center">
              <span className="font-mono text-[10px] uppercase text-slate-400">Calculated Body Mass Index (BMI)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-cyan-300">
                  {bmi !== null ? `${bmi} kg/m²` : 'Enter height & weight'}
                </span>
                {bmi !== null && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    bmi < 18.5 ? 'text-amber-400' :
                    bmi < 25 ? 'text-emerald-400' :
                    bmi < 30 ? 'text-amber-300' : 'text-rose-400'
                  }`}>
                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal range' : bmi < 30 ? 'Overweight' : 'Obese'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Context & Diabetes History */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Clinical History & Baseline Targets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {/* Existing Diabetes Status */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Existing Diabetes Diagnosis
              </label>
              <select
                value={formData.diabetesStatus}
                onChange={(e) => setFormData({ ...formData, diabetesStatus: e.target.value as DiabetesStatusType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="no">No</option>
                <option value="yes">Yes (Diagnosed by Clinician)</option>
                <option value="not_sure">Not Sure / Unconfirmed</option>
              </select>
            </div>

            {/* Diabetes Type */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Diabetes Classification (If Known)
              </label>
              <select
                disabled={formData.diabetesStatus !== 'yes'}
                value={formData.diabetesType}
                onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value as DiabetesType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 disabled:opacity-40"
              >
                <option value="none">None / Not Applicable</option>
                <option value="type_1">Type 1 Diabetes</option>
                <option value="type_2">Type 2 Diabetes</option>
                <option value="gestational">Gestational Diabetes</option>
                <option value="lada">LADA (Latent Autoimmune)</option>
                <option value="unknown">Other / Unspecified</option>
              </select>
            </div>

            {/* Preferred Units */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Preferred Glucose Units
              </label>
              <select
                value={formData.preferredUnit}
                onChange={(e) => setFormData({ ...formData, preferredUnit: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="mg/dL">mg/dL (Standard in US, India, Japan)</option>
                <option value="mmol/L">mmol/L (Standard in UK, Canada, Australia)</option>
              </select>
            </div>

            {/* Target Glucose Min */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Personal Fasting Target Min (mg/dL)
              </label>
              <input
                type="number"
                value={formData.targetGlucoseMin}
                onChange={(e) => setFormData({ ...formData, targetGlucoseMin: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Target Glucose Max */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Personal Target Max (mg/dL)
              </label>
              <input
                type="number"
                value={formData.targetGlucoseMax}
                onChange={(e) => setFormData({ ...formData, targetGlucoseMax: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Default Context */}
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Primary Sampling Routine
              </label>
              <select
                value={formData.defaultMeasurementContext}
                onChange={(e) => setFormData({ ...formData, defaultMeasurementContext: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="fasting">Morning Fasting</option>
                <option value="before_meal">Pre-Meal (Preprandial)</option>
                <option value="2h_post_meal">2h After Meal (Postprandial)</option>
                <option value="bedtime">Bedtime</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Dietary Preferences & Allergies */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Dietary Pattern & Food Allergies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Dietary Preference / Cultural Style
              </label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as DietaryPreference })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="odisha_traditional">Odisha Traditional (Dalma, Santula, Usuna Rice, Saga)</option>
                <option value="vegetarian">Vegetarian (Lacto/Ovo)</option>
                <option value="vegan">Vegan (100% Plant-Based)</option>
                <option value="low_sodium">Low Sodium / DASH-aligned</option>
                <option value="diabetic_friendly">Standard Diabetic-Friendly</option>
                <option value="all">Unrestricted / Omnivore</option>
              </select>
            </div>

            <div>
              <label className="block font-mono uppercase text-slate-400 mb-1.5">
                Food Allergies & Intolerances
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Mustard, peanuts, gluten, lactose..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Consent & Privacy Agreement */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={formData.consentGiven}
              onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
              className="mt-1 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="consent-checkbox" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
              <strong className="text-white block mb-0.5">Explicit Informed Consent for Health Information Storage:</strong>
              I consent to the local browser storage of my health-related profile, self-reported diabetes status, and measurement telemetry for personalized educational and trend analysis purposes. I understand that this web platform is an experimental prototype and that all data remains securely on my local device unless explicitly exported by me.
            </label>
          </div>

          {consentError && (
            <p className="text-xs text-rose-400 font-medium">
              You must provide informed consent before saving your health-related profile.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            {saveSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Profile saved successfully</span>
              </span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold rounded-lg shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>Save Health Profile</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
