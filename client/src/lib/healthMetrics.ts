/**
 * Health metrics (weight, pressure, mood, sleep): types, storage, and helpers.
 * Data is persisted in localStorage.
 */

export type MetricSlug = "weight" | "pressure" | "mood" | "sleep";

export interface WeightEntry {
  date: string; // ISO
  valueKg: number;
  note?: string;
}

export interface PressureEntry {
  date: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  note?: string;
}

export interface MoodEntry {
  date: string;
  value: string;
  note?: string;
}

export interface SleepEntry {
  date: string;
  hours: number;
  quality?: string;
  note?: string;
}

export type MetricEntry =
  | { type: "weight"; data: WeightEntry }
  | { type: "pressure"; data: PressureEntry }
  | { type: "mood"; data: MoodEntry }
  | { type: "sleep"; data: SleepEntry };

export const METRIC_CONFIG: Record<
  MetricSlug,
  { label: string; unit?: string; color: string }
> = {
  weight: { label: "Вес", unit: "кг", color: "text-rose-500" },
  pressure: { label: "Давление", unit: "мм рт. ст.", color: "text-blue-500" },
  mood: { label: "Настроение", unit: "", color: "text-amber-500" },
  sleep: { label: "Сон", unit: "ч", color: "text-indigo-500" },
};

const STORAGE_KEYS: Record<MetricSlug, string> = {
  weight: "mommy_health_weight",
  pressure: "mommy_health_pressure",
  mood: "mommy_health_mood",
  sleep: "mommy_health_sleep",
};

const SEEDED_KEY = "mommy_health_seeded";

function loadJson<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultVal;
    return JSON.parse(raw) as T;
  } catch {
    return defaultVal;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// --- Weight ---
export function getWeightHistory(limit = 50): WeightEntry[] {
  const list = loadJson<WeightEntry[]>(STORAGE_KEYS.weight, []);
  return [...list].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, limit);
}

export function getLatestWeight(): WeightEntry | null {
  const list = getWeightHistory(1);
  return list[0] ?? null;
}

export function addWeightEntry(entry: WeightEntry): void {
  const list = loadJson<WeightEntry[]>(STORAGE_KEYS.weight, []);
  list.push(entry);
  saveJson(STORAGE_KEYS.weight, list);
}

// --- Pressure ---
export function getPressureHistory(limit = 50): PressureEntry[] {
  const list = loadJson<PressureEntry[]>(STORAGE_KEYS.pressure, []);
  return [...list].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, limit);
}

export function getLatestPressure(): PressureEntry | null {
  const list = getPressureHistory(1);
  return list[0] ?? null;
}

export function addPressureEntry(entry: PressureEntry): void {
  const list = loadJson<PressureEntry[]>(STORAGE_KEYS.pressure, []);
  list.push(entry);
  saveJson(STORAGE_KEYS.pressure, list);
}

// --- Mood ---
export const MOOD_OPTIONS = [
  "Отличное",
  "Хорошее",
  "Нормальное",
  "Тревожное",
  "Плохое",
] as const;

export function getMoodHistory(limit = 50): MoodEntry[] {
  const list = loadJson<MoodEntry[]>(STORAGE_KEYS.mood, []);
  return [...list].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, limit);
}

export function getLatestMood(): MoodEntry | null {
  const list = getMoodHistory(1);
  return list[0] ?? null;
}

export function addMoodEntry(entry: MoodEntry): void {
  const list = loadJson<MoodEntry[]>(STORAGE_KEYS.mood, []);
  list.push(entry);
  saveJson(STORAGE_KEYS.mood, list);
}

// --- Sleep ---
export function getSleepHistory(limit = 50): SleepEntry[] {
  const list = loadJson<SleepEntry[]>(STORAGE_KEYS.sleep, []);
  return [...list].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, limit);
}

export function getLatestSleep(): SleepEntry | null {
  const list = getSleepHistory(1);
  return list[0] ?? null;
}

export function addSleepEntry(entry: SleepEntry): void {
  const list = loadJson<SleepEntry[]>(STORAGE_KEYS.sleep, []);
  list.push(entry);
  saveJson(STORAGE_KEYS.sleep, list);
}

// --- Helpers for display ---
export function formatMetricValue(
  slug: MetricSlug,
  entry: WeightEntry | PressureEntry | MoodEntry | SleepEntry | null
): string {
  if (!entry) return "—";
  switch (slug) {
    case "weight":
      return `${(entry as WeightEntry).valueKg} кг`;
    case "pressure":
      const p = entry as PressureEntry;
      return p.pulse != null ? `${p.systolic}/${p.diastolic} (${p.pulse})` : `${p.systolic}/${p.diastolic}`;
    case "mood":
      return (entry as MoodEntry).value;
    case "sleep":
      return `${(entry as SleepEntry).hours} ч`;
    default:
      return "—";
  }
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return "Сегодня";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Вчера";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateForInput(iso: string): string {
  return iso.slice(0, 16); // date + time for datetime-local
}

// --- Chart data for dynamics (oldest first for time axis) ---
export const MOOD_TO_NUMBER: Record<string, number> = {
  Отличное: 5,
  Хорошее: 4,
  Нормальное: 3,
  Тревожное: 2,
  Плохое: 1,
};

export type ChartPoint =
  | { date: string; dateLabel: string; value: number }
  | { date: string; dateLabel: string; systolic: number; diastolic: number };

export function getWeightChartData(): { date: string; dateLabel: string; value: number }[] {
  const list = getWeightHistory(100);
  return [...list]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({
      date: e.date,
      dateLabel: formatDateShort(e.date),
      value: e.valueKg,
    }));
}

export function getPressureChartData(): { date: string; dateLabel: string; systolic: number; diastolic: number }[] {
  const list = getPressureHistory(100);
  return [...list]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({
      date: e.date,
      dateLabel: formatDateShort(e.date),
      systolic: e.systolic,
      diastolic: e.diastolic,
    }));
}

export function getMoodChartData(): { date: string; dateLabel: string; value: number; label: string }[] {
  const list = getMoodHistory(100);
  return [...list]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({
      date: e.date,
      dateLabel: formatDateShort(e.date),
      value: MOOD_TO_NUMBER[e.value] ?? 3,
      label: e.value,
    }));
}

export function getSleepChartData(): { date: string; dateLabel: string; value: number }[] {
  const list = getSleepHistory(100);
  return [...list]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((e) => ({
      date: e.date,
      dateLabel: formatDateShort(e.date),
      value: e.hours,
    }));
}

// --- Prefilled sample data (run once) ---
function isoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

export function seedSampleDataIfNeeded(): void {
  try {
    if (localStorage.getItem(SEEDED_KEY)) return;
    const baseWeight = 62;
    const weightEntries: WeightEntry[] = [0, 2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28].map((daysAgo) => ({
      date: isoDate(daysAgo),
      valueKg: baseWeight + (28 - daysAgo) * 0.08 + (Math.random() - 0.5) * 0.4,
    }));
    weightEntries.forEach((e) => (e.valueKg = Math.round(e.valueKg * 10) / 10));
    saveJson(STORAGE_KEYS.weight, weightEntries);

    const pressureEntries: PressureEntry[] = [0, 1, 3, 5, 8, 10, 12, 15, 17, 20, 22, 24, 27].map((daysAgo) => ({
      date: isoDate(daysAgo),
      systolic: 108 + Math.floor(Math.random() * 18),
      diastolic: 68 + Math.floor(Math.random() * 12),
      pulse: 72 + Math.floor((Math.random() - 0.5) * 12),
    }));
    saveJson(STORAGE_KEYS.pressure, pressureEntries);

    const moods = [...MOOD_OPTIONS];
    const moodValues = [0, 1, 2, 3, 4, 2, 3, 4, 3, 2, 4, 3, 3, 4, 2]; // indices: variety for chart
    const moodEntries: MoodEntry[] = [0, 1, 2, 4, 5, 7, 8, 10, 12, 14, 16, 18, 20, 22, 25].map((daysAgo, i) => ({
      date: isoDate(daysAgo),
      value: moods[moodValues[i] ?? 3],
    }));
    saveJson(STORAGE_KEYS.mood, moodEntries);

    const sleepEntries: SleepEntry[] = [0, 1, 3, 4, 6, 8, 9, 11, 13, 15, 17, 19, 21, 23, 26].map((daysAgo) => ({
      date: isoDate(daysAgo),
      hours: 6.5 + Math.random() * 2.5,
    }));
    sleepEntries.forEach((e) => (e.hours = Math.round(e.hours * 10) / 10));
    saveJson(STORAGE_KEYS.sleep, sleepEntries);

    localStorage.setItem(SEEDED_KEY, "1");
  } catch (_) {}
}

// Run seed as soon as the module loads (in browser) so data exists before first render
if (typeof localStorage !== "undefined") {
  seedSampleDataIfNeeded();
}
