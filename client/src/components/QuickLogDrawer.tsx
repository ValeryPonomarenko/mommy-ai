"use client";

import { useState } from "react";
import { Link } from "wouter";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type MetricSlug,
  METRIC_CONFIG,
  addWeightEntry,
  addPressureEntry,
  addMoodEntry,
  addSleepEntry,
  MOOD_OPTIONS,
} from "@/lib/healthMetrics";

interface QuickLogDrawerProps {
  metric: MetricSlug | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogged: () => void;
}

export function QuickLogDrawer({ metric, open, onOpenChange, onLogged }: QuickLogDrawerProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [pulse, setPulse] = useState("");
  const [moodValue, setMoodValue] = useState("");
  const [sleepHours, setSleepHours] = useState("");

  if (!metric) return null;

  const config = METRIC_CONFIG[metric];

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
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-xl font-serif">{config.label}</DrawerTitle>
          <p className="text-sm text-muted-foreground">Быстрая запись</p>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Дата</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>

          {metric === "weight" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Вес, кг</label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="65.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="mt-1.5 h-12 text-lg rounded-xl"
                autoFocus
              />
            </div>
          )}

          {metric === "pressure" && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Верх</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Низ</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Пульс</label>
                <Input
                  type="number"
                  placeholder="72"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>
            </div>
          )}

          {metric === "mood" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Настроение
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={moodValue === opt ? "default" : "outline"}
                    size="sm"
                    className="rounded-full h-9"
                    onClick={() => setMoodValue(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {metric === "sleep" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Часов сна</label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="mt-1.5 h-12 text-lg rounded-xl"
                autoFocus
              />
            </div>
          )}

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium">
            Записать
          </Button>
        </form>
        <DrawerFooter className="border-t pt-4 pb-6">
          <Link href={metric ? `/track/${metric}` : "/"} onClick={() => onOpenChange(false)}>
            <Button variant="ghost" className="w-full rounded-xl text-muted-foreground">
              Вся история →
            </Button>
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
