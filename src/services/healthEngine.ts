import { GlucoseRecord, UserProfile, MeasurementContext } from '../types';

export interface TrendAnalysisResult {
  hasSufficientData: boolean;
  latestRecord: GlucoseRecord | null;
  previousRecord: GlucoseRecord | null;
  absoluteDiff: number | null;
  percentageDiff: number | null;
  direction: 'rising' | 'falling' | 'stable' | 'insufficient';
  contextMatch: boolean;
  explanation: string;
}

export interface HealthInsightResult {
  messageType: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  headline: string;
  body: string;
  encouragement: string | null;
  urgency: 'nominal' | 'advisory' | 'attention' | 'emergency';
  clinicalDisclaimer: string;
}

export class HealthEngine {
  /**
   * Convert between mg/dL and mmol/L
   * 1 mmol/L glucose = 18.0182 mg/dL
   */
  public static toMgDl(value: number, unit: 'mg/dL' | 'mmol/L'): number {
    return unit === 'mg/dL' ? value : Math.round(value * 18.0182);
  }

  public static toMmolL(value: number, unit: 'mg/dL' | 'mmol/L'): number {
    return unit === 'mmol/L' ? value : Number((value / 18.0182).toFixed(1));
  }

  /**
   * Compare latest vs previous measurement strictly accounting for units and context.
   */
  public static calculateTrend(records: GlucoseRecord[]): TrendAnalysisResult {
    // Only analyze validated or user-entered measurements for clinical trend analysis
    const validRecords = records
      .filter((r) => r.source === 'independent_meter' || r.source === 'manual_entry')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (validRecords.length < 1) {
      return {
        hasSufficientData: false,
        latestRecord: null,
        previousRecord: null,
        absoluteDiff: null,
        percentageDiff: null,
        direction: 'insufficient',
        contextMatch: false,
        explanation: 'There is not enough reliable information to assess this pattern. Record additional appropriately timed measurements or seek professional advice.',
      };
    }

    const latest = validRecords[0];
    if (validRecords.length < 2) {
      return {
        hasSufficientData: true,
        latestRecord: latest,
        previousRecord: null,
        absoluteDiff: null,
        percentageDiff: null,
        direction: 'stable',
        contextMatch: true,
        explanation: 'Single validated record on file. At least two records under similar timing conditions are recommended for comparative trend evaluation.',
      };
    }

    const previous = validRecords[1];
    // Normalize both to latest unit for calculation
    const latestVal = latest.value;
    const prevValInLatestUnit =
      latest.unit === previous.unit
        ? previous.value
        : latest.unit === 'mg/dL'
        ? HealthEngine.toMgDl(previous.value, previous.unit)
        : HealthEngine.toMmolL(previous.value, previous.unit);

    const absDiff = Number((latestVal - prevValInLatestUnit).toFixed(1));
    const pctDiff = Number(((absDiff / prevValInLatestUnit) * 100).toFixed(1));

    const contextMatch = latest.context === previous.context;
    let direction: 'rising' | 'falling' | 'stable' = 'stable';
    if (absDiff > 12) {
      direction = 'rising';
    } else if (absDiff < -12) {
      direction = 'falling';
    }

    let explanation = '';
    if (contextMatch) {
      if (absDiff > 0) {
        explanation = `Your recorded value increased by ${absDiff} ${latest.unit} compared with the previous ${latest.context.replace('_', ' ')} measurement.`;
      } else if (absDiff < 0) {
        explanation = `Your recorded value decreased by ${Math.abs(absDiff)} ${latest.unit} compared with the previous ${latest.context.replace('_', ' ')} measurement.`;
      } else {
        explanation = `Your recorded value is identical (${latestVal} ${latest.unit}) to your previous ${latest.context.replace('_', ' ')} measurement.`;
      }
    } else {
      explanation = `Your latest reading is ${latestVal} ${latest.unit} (${latest.context.replace('_', ' ')}), compared to previous ${prevValInLatestUnit} ${latest.unit} (${previous.context.replace('_', ' ')}). Note: Values taken at different meal contexts naturally vary and cannot be directly compared without accounting for nutritional intake.`;
    }

    return {
      hasSufficientData: true,
      latestRecord: latest,
      previousRecord: previous,
      absoluteDiff: absDiff,
      percentageDiff: pctDiff,
      direction,
      contextMatch,
      explanation,
    };
  }

  /**
   * Generate clinical guidance following strict mandated guidelines A through F.
   */
  public static evaluateHealthStatus(
    records: GlucoseRecord[],
    profile: UserProfile | null
  ): HealthInsightResult {
    const validRecords = records
      .filter((r) => r.source === 'independent_meter' || r.source === 'manual_entry')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // F: Insufficient data
    if (validRecords.length === 0) {
      return {
        messageType: 'F',
        headline: 'Insufficient Recorded Data',
        body: 'There is not enough reliable information to assess this pattern. Record additional appropriately timed measurements or seek professional advice.',
        encouragement: null,
        urgency: 'advisory',
        clinicalDisclaimer: 'Experimental acetone sensor signals do not substitute for validated blood glucose tests.',
      };
    }

    const latest = validRecords[0];
    const latestMgDl = HealthEngine.toMgDl(latest.value, latest.unit);
    const hasReportedDiabetes = profile?.diabetesStatus === 'yes';

    // Target range definition (ADA guidelines)
    const isFasting = latest.context === 'fasting' || latest.context === 'before_meal';
    const minTarget = profile?.targetGlucoseMin || 70;
    const maxTarget = hasReportedDiabetes
      ? isFasting ? 130 : 180
      : isFasting ? 99 : 140;

    // Check emergency thresholds
    if (latestMgDl < 54) {
      return {
        messageType: 'E',
        headline: 'Critical Low Glucose Alert (< 54 mg/dL)',
        body: 'Your recorded glucose reading indicates severe hypoglycemia. Consume 15–20g of rapid-acting carbohydrates (e.g., fruit juice, glucose tablets) immediately. If consciousness is impaired or symptoms persist, call emergency medical services immediately.',
        encouragement: null,
        urgency: 'emergency',
        clinicalDisclaimer: 'Emergency clinical alert. Do not delay medical intervention.',
      };
    }

    // Check multiple rising measurements (trend over last 3+ readings)
    const recentReadings = validRecords.slice(0, 4);
    let isConsistentRise = false;
    if (recentReadings.length >= 3) {
      const v0 = HealthEngine.toMgDl(recentReadings[0].value, recentReadings[0].unit);
      const v1 = HealthEngine.toMgDl(recentReadings[1].value, recentReadings[1].unit);
      const v2 = HealthEngine.toMgDl(recentReadings[2].value, recentReadings[2].unit);
      if (v0 > v1 && v1 > v2 && v0 - v2 >= 25) {
        isConsistentRise = true;
      }
    }

    // C: Several validated measurements show a rising trend
    if (isConsistentRise) {
      return {
        messageType: 'C',
        headline: 'Rising Measurement Trend Detected',
        body: 'Your recorded measurements show a rising trend. Consider discussing this pattern with your healthcare professional. Do not change medication based on this website alone.',
        encouragement: 'Keep monitoring consistently and note any recent changes in meals, physical routine, stress, or hydration.',
        urgency: 'attention',
        clinicalDisclaimer: 'Medical decisions and prescription adjustments must only be made with a licensed physician.',
      };
    }

    // B: Higher than previous value
    if (validRecords.length >= 2) {
      const prev = validRecords[1];
      const prevMgDl = HealthEngine.toMgDl(prev.value, prev.unit);
      if (latestMgDl > prevMgDl + 15) {
        return {
          messageType: 'B',
          headline: 'Reading Higher Than Previous Measurement',
          body: 'Your latest recorded value is higher than your previous measurement. Glucose can vary with meals, activity, illness, medication, and time of day. Review the measurement context and repeat testing according to your healthcare professional\'s advice.',
          encouragement: 'Glucose values naturally oscillate throughout the 24-hour cycle in response to food and circadian rhythms.',
          urgency: 'advisory',
          clinicalDisclaimer: 'A single high reading does not indicate a chronic trend or clinical diagnosis.',
        };
      }
    }

    // E: Person reports NO previous diabetes diagnosis but has concerning validated measurements
    if (!hasReportedDiabetes && (
      (isFasting && latestMgDl >= 126) ||
      (!isFasting && latestMgDl >= 200)
    )) {
      return {
        messageType: 'E',
        headline: 'Result Warrants Clinical Evaluation',
        body: 'Your recorded result may warrant further assessment. A single reading does not establish a diagnosis. Follow an appropriate clinical testing pathway and consult a qualified healthcare professional.',
        encouragement: null,
        urgency: 'attention',
        clinicalDisclaimer: 'Clinical diagnosis of diabetes requires standardized laboratory venous plasma tests (FPG, OGTT, or HbA1c) repeated on separate days.',
      };
    }

    // D: When user reports diabetes
    if (hasReportedDiabetes) {
      const inPersonalTarget = latestMgDl >= minTarget && latestMgDl <= maxTarget;
      return {
        messageType: 'D',
        headline: inPersonalTarget ? 'Within Prescribed Target Range' : 'Outside Standard Target Window',
        body: 'Continue your prescribed diabetes management plan, monitor according to your clinician\'s instructions, and discuss persistent changes with your healthcare professional.',
        encouragement: inPersonalTarget
          ? 'Your recent recorded measurements are moving in a favorable direction. Keep following your agreed care plan and continue monitoring consistently.'
          : 'Review medication timing, meal carbohydrate content, and activity with your diabetes care team.',
        urgency: inPersonalTarget ? 'nominal' : 'advisory',
        clinicalDisclaimer: 'Always follow the personalized targets established by your endocrinologist or primary physician.',
      };
    }

    // A: When a validated measurement is within the relevant target range
    if (latestMgDl >= minTarget && latestMgDl <= maxTarget) {
      return {
        messageType: 'A',
        headline: 'Measurement Within Reference Target Range',
        body: 'Your recorded measurement is within the selected reference or personal target range. Continue following your healthcare professional\'s recommendations and maintain healthy habits.',
        encouragement: 'Your recent recorded measurements remain stable within an appropriate personal target. Continue your consistent healthy habits.',
        urgency: 'nominal',
        clinicalDisclaimer: 'Maintain routine annual health checks with your primary healthcare provider.',
      };
    }

    // Default advisory
    return {
      messageType: 'A',
      headline: 'Recorded Measurement Logged',
      body: 'Your recorded measurement is logged. Continue following your healthcare professional\'s recommendations and maintain healthy habits.',
      encouragement: 'Consistently logging context (fasting vs post-meal) provides the highest clarity for your healthcare team.',
      urgency: 'nominal',
      clinicalDisclaimer: 'Reference ranges vary by clinical profile and laboratory methods.',
    };
  }
}
