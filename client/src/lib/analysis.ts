/**
 * Analysis (lab result) types and mock data for the Анализы flow.
 */

export type AnalysisStatus = "normal" | "attention" | "alert";

export interface AnalysisIndicator {
  name: string;
  value: string;
  unit?: string;
  reference?: string;
  status: AnalysisStatus;
  /** 0–100 for progress-style display */
  percentInRange?: number;
}

export interface AnalysisReference {
  title: string;
  description?: string;
  url?: string;
  source?: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  date: string;
  /** Short date for list view */
  dateShort: string;
  status: AnalysisStatus;
  summary: string;
  /** Optional hint for the user (e.g. what to do next) */
  hint?: string;
  indicators: AnalysisIndicator[];
  references?: AnalysisReference[];
}

const MOCK_ANALYSES: AnalysisResult[] = [
  {
    id: "blood-general-1",
    title: "Общий анализ крови",
    date: "12 мая 2024",
    dateShort: "12 мая 2024",
    status: "normal",
    summary: "Все показатели в норме для 20-й недели беременности.",
    hint: "Продолжайте приём назначенных витаминов и при следующем визите покажите результат врачу.",
    indicators: [
      { name: "Гемоглобин", value: "118", unit: "г/л", reference: "110–140", status: "normal", percentInRange: 60 },
      { name: "Эритроциты", value: "4.2", unit: "×10¹²/л", reference: "3.5–5.5", status: "normal", percentInRange: 50 },
      { name: "Лейкоциты", value: "8.1", unit: "×10⁹/л", reference: "4.0–9.0", status: "normal", percentInRange: 70 },
      { name: "Тромбоциты", value: "245", unit: "×10⁹/л", reference: "150–400", status: "normal", percentInRange: 45 },
      { name: "СОЭ", value: "18", unit: "мм/ч", reference: "2–15 (берем.)", status: "attention", percentInRange: 85 },
    ],
    references: [
      { title: "Нормы ОАК при беременности", source: "Клинические рекомендации Минздрава РФ", description: "Референсные интервалы для беременных могут отличаться от стандартных." },
      { title: "Анемия и беременность", source: "WHO", url: "https://www.who.int", description: "Критерии анемии у беременных: Hb < 110 г/л." },
    ],
  },
  {
    id: "ferritin-1",
    title: "Ферритин",
    date: "10 апреля 2024",
    dateShort: "10 апр 2024",
    status: "attention",
    summary: "Показатель на нижней границе нормы. Рекомендуется консультация врача.",
    hint: "Обсудите с врачом приём препаратов железа и питание, богатое железом (мясо, печень, бобовые, тёмная зелень).",
    indicators: [
      { name: "Ферритин", value: "22", unit: "нг/мл", reference: "15–150", status: "attention", percentInRange: 15 },
    ],
    references: [
      { title: "Дефицит железа при беременности", source: "Федеральные клинические рекомендации", description: "Ферритин < 30 нг/мл у беременных часто требует коррекции для профилактики анемии." },
    ],
  },
];

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return MOCK_ANALYSES.find((a) => a.id === id);
}

export function getAllAnalyses(): AnalysisResult[] {
  return MOCK_ANALYSES;
}

export function getStatusColor(status: AnalysisStatus): string {
  switch (status) {
    case "normal":
      return "green";
    case "attention":
      return "amber";
    case "alert":
      return "red";
    default:
      return "gray";
  }
}
