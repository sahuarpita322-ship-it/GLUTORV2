import { GlucoseRecord, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  fullName: 'Arpita Sahu',
  age: 32,
  gender: 'female',
  weightKg: 58.5,
  heightCm: 162,
  diabetesStatus: 'not_sure',
  diabetesType: 'none',
  defaultMeasurementContext: 'fasting',
  dietaryPreference: 'odisha_traditional',
  allergies: 'None reported',
  consentGiven: true,
  targetGlucoseMin: 70,
  targetGlucoseMax: 140,
  preferredUnit: 'mg/dL',
};

// Clearly labelled sample records for demonstration / historical trends inspection
export const DEMO_GLUCOSE_RECORDS: GlucoseRecord[] = [
  {
    id: 'demo-rec-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago morning
    source: 'independent_meter',
    value: 94,
    unit: 'mg/dL',
    context: 'fasting',
    notes: 'Morning fasting fingerstick check with certified glucometer.',
    correlatedAcetoneRaw: 465,
    calibratedAcetonePpm: 0.82,
    isSimulated: true,
  },
  {
    id: 'demo-rec-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), // 2 days ago post-meal
    source: 'independent_meter',
    value: 128,
    unit: 'mg/dL',
    context: '2h_post_meal',
    notes: '2 hours after lunch (Dalma with small portion of parboiled rice and santula).',
    correlatedAcetoneRaw: 492,
    calibratedAcetonePpm: 0.95,
    isSimulated: true,
  },
  {
    id: 'demo-rec-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday morning
    source: 'independent_meter',
    value: 98,
    unit: 'mg/dL',
    context: 'fasting',
    notes: 'Fasting reading before tea.',
    correlatedAcetoneRaw: 470,
    calibratedAcetonePpm: 0.85,
    isSimulated: true,
  },
  {
    id: 'demo-rec-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday post-meal
    source: 'independent_meter',
    value: 135,
    unit: 'mg/dL',
    context: '2h_post_meal',
    notes: 'Post-lunch reading after vegetable curry and roti.',
    correlatedAcetoneRaw: 510,
    calibratedAcetonePpm: 1.05,
    isSimulated: true,
  },
  {
    id: 'demo-rec-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Today morning
    source: 'independent_meter',
    value: 102,
    unit: 'mg/dL',
    context: 'fasting',
    notes: 'Today morning fasting check.',
    correlatedAcetoneRaw: 485,
    calibratedAcetonePpm: 0.89,
    isSimulated: true,
  },
];
