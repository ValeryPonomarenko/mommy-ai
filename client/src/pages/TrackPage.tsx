import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Scale, Heart, Smile, Moon, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type MetricSlug,
  METRIC_CONFIG,
  getWeightHistory,
  getPressureHistory,
  getMoodHistory,
  getSleepHistory,
  getWeightChartData,
  getPressureChartData,
  getMoodChartData,
  getSleepChartData,
  addWeightEntry,
  addPressureEntry,
  addMoodEntry,
  addSleepEntry,
  MOOD_OPTIONS,
  formatDateShort,
  formatMetricValue,
} from "@/lib/healthMetrics";

const METRIC_SLUGS: MetricSlug[] = ["weight", "pressure", "mood", "sleep"];
const METRIC_ICONS: Record<MetricSlug, typeof Scale> = {
  weight: Scale,
  pressure: Heart,
  mood: Smile,
  sleep: Moon,
};

function isMetricSlug(s: string): s is MetricSlug {
  return METRIC_SLUGS.includes(s as MetricSlug);
}

function MetricDynamicsChart({ metric, historyLength }: { metric: MetricSlug; historyLength: number }) {
  const chartData = useMemo(() => {
    switch (metric) {
      case "weight":
        return getWeightChartData();
      case "pressure":
        return getPressureChartData();
      case "mood":
        return getMoodChartData();
      case "sleep":
        return getSleepChartData();
      default:
        return [];
    }
  }, [metric, historyLength]);

  // For pressure: two separate single-line datasets (Recharts multi-Line is unreliable)
  const pressureSystolicData = useMemo(() => {
    if (metric !== "pressure" || chartData.length < 2) return [];
    const raw = chartData as { dateLabel: string; systolic: number }[];
    return raw.map((p) => ({ dateLabel: p.dateLabel, value: Number(p.systolic) }));
  }, [metric, chartData]);

  const pressureDiastolicData = useMemo(() => {
    if (metric !== "pressure" || chartData.length < 2) return [];
    const raw = chartData as { dateLabel: string; diastolic: number }[];
    return raw.map((p) => ({ dateLabel: p.dateLabel, value: Number(p.diastolic) }));
  }, [metric, chartData]);

  const hasEnoughData = chartData.length >= 2;
  const colors = {
    weight: { stroke: "#e11d48" },
    pressure: { systolic: "#2563eb", diastolic: "#7c3aed" },
    mood: { stroke: "#d97706" },
    sleep: { stroke: "#4f46e5" },
  };

  if (!hasEnoughData) {
    return (
      <section className="mt-6 rounded-2xl border bg-muted/20 p-6 text-center">
        <TrendingUp className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">
          Добавьте минимум 2 записи, чтобы увидеть динамику
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-2xl border bg-card p-4 shadow-sm">
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5" />
        Динамика
      </h2>
      <div className={metric === "pressure" ? "space-y-4" : "h-[220px] w-full min-h-[200px]"}>
        {metric === "pressure" && pressureSystolicData.length >= 2 ? (
          <>
            <div className="h-[140px] w-full">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">Верхнее (систола)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pressureSystolicData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 140]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v, "Верхнее"]} />
                  <Line type="monotone" dataKey="value" stroke={colors.pressure.systolic} strokeWidth={2} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[140px] w-full">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">Нижнее (диастола)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pressureDiastolicData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                  <XAxis dataKey="dateLabel" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v, "Нижнее"]} />
                  <Line type="monotone" dataKey="value" stroke={colors.pressure.diastolic} strokeWidth={2} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="h-[220px] w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                key={metric}
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  domain={metric === "mood" ? [1, 5] : undefined}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  formatter={
                    metric === "mood"
                      ? (value: number, _name: string, props: unknown) =>
                          [(props as { payload?: { label?: string } })?.payload?.label ?? value, "Настроение"]
                      : undefined
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={metric === "weight" ? "Вес, кг" : metric === "sleep" ? "Часов" : "Настроение"}
                  stroke={metric === "weight" ? colors.weight.stroke : metric === "mood" ? colors.mood.stroke : colors.sleep.stroke}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

interface TrackPageProps {
  params: { metric?: string };
}

export default function TrackPage({ params }: TrackPageProps) {
  const metric = params?.metric;
  if (!metric || !isMetricSlug(metric)) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">Раздел не найден</p>
        <Link href="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    );
  }

  const config = METRIC_CONFIG[metric];
  const Icon = METRIC_ICONS[metric];
  const [history, setHistory] = useState<unknown[]>([]);

  useEffect(() => {
    switch (metric) {
      case "weight":
        setHistory(getWeightHistory());
        break;
      case "pressure":
        setHistory(getPressureHistory());
        break;
      case "mood":
        setHistory(getMoodHistory());
        break;
      case "sleep":
        setHistory(getSleepHistory());
        break;
    }
  }, [metric]);

  const refreshHistory = () => {
    switch (metric) {
      case "weight":
        setHistory(getWeightHistory());
        break;
      case "pressure":
        setHistory(getPressureHistory());
        break;
      case "mood":
        setHistory(getMoodHistory());
        break;
      case "sleep":
        setHistory(getSleepHistory());
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans pb-12">
      <div className="container mx-auto px-4 py-5 max-w-xl">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-primary">
            <ChevronLeft className="w-4 h-4 mr-1" /> Назад
          </Button>
        </Link>

        <header className="flex items-center gap-3 mb-6">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${metric === "weight" ? "from-rose-500/20 to-rose-500/5" : metric === "pressure" ? "from-blue-500/20 to-blue-500/5" : metric === "mood" ? "from-amber-500/20 to-amber-500/5" : "from-indigo-500/20 to-indigo-500/5"} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{config.label}</h1>
            <p className="text-sm text-muted-foreground">История записей</p>
          </div>
        </header>

        <LogForm metric={metric} onLogged={refreshHistory} />

        <MetricDynamicsChart metric={metric} historyLength={history.length} />

        <section className="mt-8">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
            История
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center rounded-xl bg-muted/30">
              Нет записей. Добавьте первую выше.
            </p>
          ) : (
            <ul className="space-y-1">
              <AnimatePresence mode="popLayout">
                {(history as { date: string; [k: string]: unknown }[]).map((e, i) => {
                  const display = formatMetricValue(metric, e as never);
                  return (
                    <motion.li
                      key={e.date + i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/40 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground">{formatDateShort(e.date)}</span>
                      <span className="font-medium tabular-nums">{display}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function LogForm({
  metric,
  onLogged,
}: {
  metric: MetricSlug;
  onLogged: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [moodValue, setMoodValue] = useState("");
  const [sleepHours, setSleepHours] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateIso = new Date(date + "T12:00:00").toISOString();

    switch (metric) {
      case "weight": {
        const v = parseFloat(weightKg.replace(",", "."));
        if (Number.isNaN(v)) return;
        addWeightEntry({ date: dateIso, valueKg: v });
        setWeightKg("");
        break;
      }
      case "pressure": {
        const s = parseInt(systolic, 10);
        const d = parseInt(diastolic, 10);
        if (Number.isNaN(s) || Number.isNaN(d)) return;
        addPressureEntry({
          date: dateIso,
          systolic: s,
          diastolic: d,
          pulse: pulse ? parseInt(pulse, 10) || undefined : undefined,
        });
        setSystolic("");
        setDiastolic("");
        setPulse("");
        break;
      }
      case "mood": {
        if (!moodValue.trim()) return;
        addMoodEntry({ date: dateIso, value: moodValue.trim() });
        setMoodValue("");
        break;
      }
      case "sleep": {
        const h = parseFloat(sleepHours.replace(",", "."));
        if (Number.isNaN(h)) return;
        addSleepEntry({ date: dateIso, hours: h });
        setSleepHours("");
        break;
      }
    }
    onLogged();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-4 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Plus className="w-4 h-4" />
        Новая запись
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="min-w-[120px]">
          <label className="sr-only">Дата</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 rounded-lg text-sm"
          />
        </div>

        {metric === "weight" && (
          <>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="65 кг"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="h-10 w-24 rounded-lg text-sm"
            />
            <Button type="submit" size="sm" className="h-10 rounded-lg px-5 shrink-0">
              Записать
            </Button>
          </>
        )}

        {metric === "pressure" && (
          <>
            <Input
              type="number"
              placeholder="120"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="h-10 w-14 rounded-lg text-center text-sm"
            />
            <span className="text-muted-foreground pb-2">/</span>
            <Input
              type="number"
              placeholder="80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="h-10 w-14 rounded-lg text-center text-sm"
            />
            <Button type="submit" size="sm" className="h-10 rounded-lg px-5 shrink-0">
              Записать
            </Button>
          </>
        )}

        {metric === "sleep" && (
          <>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="7.5 ч"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="h-10 w-20 rounded-lg text-sm"
            />
            <Button type="submit" size="sm" className="h-10 rounded-lg px-5 shrink-0">
              Записать
            </Button>
          </>
        )}
      </div>

      {metric === "mood" && (
        <div className="flex flex-wrap gap-2 items-center">
          {MOOD_OPTIONS.map((opt) => (
            <Button
              key={opt}
              type="button"
              variant={moodValue === opt ? "default" : "outline"}
              size="sm"
              className="rounded-full h-9 text-xs"
              onClick={() => setMoodValue(opt)}
            >
              {opt}
            </Button>
          ))}
          <Button type="submit" size="sm" className="h-9 rounded-lg px-4 shrink-0" disabled={!moodValue}>
            Записать
          </Button>
        </div>
      )}
    </form>
  );
}
