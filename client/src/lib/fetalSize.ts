/**
 * Approximate fetal weight (g) and length (cm) by gestational week.
 * Based on WHO / INTERGROWTH-21st style reference values.
 * Length: crown–rump before ~20 weeks, crown–heel from ~20 weeks.
 */

export interface FetalSize {
  /** Weight in grams */
  weightG: number;
  /** Length in cm (crown–rump early, crown–heel later) */
  lengthCm: number;
}

/** Lookup table: gestational week (1–42) -> approximate weight (g) and length (cm) */
const SIZE_BY_WEEK: Record<number, FetalSize> = {
  1: { weightG: 0, lengthCm: 0 },
  2: { weightG: 0, lengthCm: 0 },
  3: { weightG: 0, lengthCm: 0 },
  4: { weightG: 0, lengthCm: 0.1 },
  5: { weightG: 0, lengthCm: 0.2 },
  6: { weightG: 0, lengthCm: 0.5 },
  7: { weightG: 0, lengthCm: 1 },
  8: { weightG: 1, lengthCm: 1.6 },
  9: { weightG: 2, lengthCm: 2.3 },
  10: { weightG: 4, lengthCm: 3.1 },
  11: { weightG: 7, lengthCm: 4.1 },
  12: { weightG: 14, lengthCm: 5.4 },
  13: { weightG: 23, lengthCm: 7.4 },
  14: { weightG: 43, lengthCm: 8.7 },
  15: { weightG: 70, lengthCm: 10.1 },
  16: { weightG: 100, lengthCm: 11.6 },
  17: { weightG: 140, lengthCm: 13 },
  18: { weightG: 190, lengthCm: 14.2 },
  19: { weightG: 240, lengthCm: 15.3 },
  20: { weightG: 300, lengthCm: 25.7 },
  21: { weightG: 360, lengthCm: 26.7 },
  22: { weightG: 430, lengthCm: 27.8 },
  23: { weightG: 501, lengthCm: 28.9 },
  24: { weightG: 600, lengthCm: 30 },
  25: { weightG: 660, lengthCm: 34.6 },
  26: { weightG: 760, lengthCm: 35.6 },
  27: { weightG: 875, lengthCm: 36.6 },
  28: { weightG: 1005, lengthCm: 37.6 },
  29: { weightG: 1153, lengthCm: 38.6 },
  30: { weightG: 1319, lengthCm: 39.9 },
  31: { weightG: 1502, lengthCm: 41.1 },
  32: { weightG: 1702, lengthCm: 42.4 },
  33: { weightG: 1918, lengthCm: 43.7 },
  34: { weightG: 2148, lengthCm: 45 },
  35: { weightG: 2383, lengthCm: 46.2 },
  36: { weightG: 2622, lengthCm: 47.4 },
  37: { weightG: 2859, lengthCm: 48.6 },
  38: { weightG: 3083, lengthCm: 49.8 },
  39: { weightG: 3288, lengthCm: 50.7 },
  40: { weightG: 3462, lengthCm: 51.2 },
  41: { weightG: 3597, lengthCm: 51.7 },
  42: { weightG: 3685, lengthCm: 51.9 },
};

/**
 * Get approximate fetal weight and length for a given gestational week.
 * @param week Gestational week (1–42). Clamped to valid range.
 */
export function getFetalSizeByWeek(week: number): FetalSize {
  const w = Math.max(1, Math.min(42, Math.round(week)));
  return SIZE_BY_WEEK[w] ?? SIZE_BY_WEEK[40];
}

/**
 * Format weight for display (e.g. "430 г" or "1,2 кг").
 */
export function formatFetalWeight(weightG: number): string {
  if (weightG >= 1000) {
    const kg = weightG / 1000;
    return `${kg % 1 === 0 ? kg : kg.toFixed(1).replace(".", ",")} кг`;
  }
  return `${Math.round(weightG)} г`;
}

/**
 * Format length for display (e.g. "27,8 см").
 */
export function formatFetalLength(lengthCm: number): string {
  const value = lengthCm < 1 ? lengthCm.toFixed(1) : String(Math.round(lengthCm * 10) / 10);
  return `${value.replace(".", ",")} см`;
}
