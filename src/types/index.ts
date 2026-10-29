export type ConnectionStatus =
  | 'disconnected'
  | 'permission_required'
  | 'connecting'
  | 'connected'
  | 'error';

export type QualityStatus = 'nominal' | 'warming_up' | 'unstable' | 'humidity_high' | 'baseline_drift';

export interface SerialDataPoint {
  id: string;
  timestamp: string; // ISO 8601
  timeMs: number;
  acetoneRaw: number | null; // Raw ADC / V
  calibratedAcetonePpm: number | null; // Calibrated ppm if model configured
  glucoseValue?: number | null; // Direct glucose from physical hardware (e.g. 109 mg/dL from Glutor)
  voltageRaw?: number | null; // Direct sensor voltage/raw value (e.g. 139 from V = 139)
  deviceTitle?: string; // Direct device title from screen (e.g. "Glutor V2.0")
  displayLines?: string[]; // Raw physical screen lines (e.g. ["Glutor V2.0", "Glucose:109 mg/dL", "V = 139"])
  temperatureC: number | null;
  humidityPct: number | null;
  ketoneIndex: number | null; // Hardware breath ketone index if supported
  qualityStatus: QualityStatus;
  isSimulated: boolean;
}

export type MeasurementSource =
  | 'independent_meter' // Certified capillary blood glucose meter
  | 'experimental_model' // Acetone-based estimation model
  | 'manual_entry'
  | 'raw_sensor';

export type MeasurementContext =
  | 'fasting'
  | 'before_meal'
  | '1h_post_meal'
  | '2h_post_meal'
  | 'bedtime'
  | 'random';

export interface GlucoseRecord {
  id: string;
  timestamp: string;
  source: MeasurementSource;
  value: number; // in mg/dL (or converted)
  unit: 'mg/dL' | 'mmol/L';
  context: MeasurementContext;
  notes?: string;
  modelVersion?: string;
  correlatedAcetoneRaw?: number | null;
  calibratedAcetonePpm?: number | null;
  isSimulated: boolean;
  qualityStatus?: QualityStatus;
}

export type GenderType = 'female' | 'male' | 'non_binary' | 'prefer_not_to_say';
export type DiabetesStatusType = 'yes' | 'no' | 'not_sure';
export type DiabetesType = 'type_1' | 'type_2' | 'gestational' | 'lada' | 'unknown' | 'none';
export type DietaryPreference = 'all' | 'vegetarian' | 'vegan' | 'odisha_traditional' | 'low_sodium' | 'diabetic_friendly';

export interface UserProfile {
  fullName: string;
  age: number | null;
  gender: GenderType;
  weightKg: number | null;
  heightCm: number | null;
  diabetesStatus: DiabetesStatusType;
  diabetesType: DiabetesType;
  defaultMeasurementContext: MeasurementContext;
  dietaryPreference: DietaryPreference;
  allergies: string;
  consentGiven: boolean;
  targetGlucoseMin: number; // e.g. 70 mg/dL
  targetGlucoseMax: number; // e.g. 140 mg/dL (or 180 postprandial)
  preferredUnit: 'mg/dL' | 'mmol/L';
}

export interface SerialLogEntry {
  id: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'system' | 'error';
  text: string;
}

export interface EstimationModelConfig {
  id: string;
  name: string;
  version: string;
  status: 'unconfigured' | 'calibrated_active';
  rSquared?: number | null;
  description: string;
  formulaDescription?: string;
  calibrationDate?: string;
}

export interface AlertThresholds {
  glucoseHigh: number; // e.g. 140 mg/dL (or custom)
  glucoseLow: number;  // e.g. 70 mg/dL (or custom)
  acetoneHigh: number; // e.g. 1.20 ppm (or custom)
  soundEnabled: boolean;
  alertsEnabled: boolean;
}

