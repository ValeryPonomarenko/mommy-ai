import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { putOnboarding } from "@/lib/authApi";

const FEELINGS_LABELS: Record<number, string> = {
  1: "Очень плохо",
  2: "Плохо",
  3: "Нормально",
  4: "Хорошо",
  5: "Отлично",
};

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { token, ready, refreshMe } = useAuth();
  const [week, setWeek] = useState(12);
  const [feelings, setFeelings] = useState(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && !token) setLocation("/login");
  }, [ready, token, setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      await putOnboarding(token, { pregnancy_week: week, feelings });
      await refreshMe();
      setLocation("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  }

  if (!ready || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Расскажите о себе</CardTitle>
          <CardDescription>Это поможет подбирать рекомендации</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="space-y-4">
              <Label>Неделя беременности</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={42}
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-primary/20 accent-primary"
                />
                <span className="text-lg font-medium w-10">{week}</span>
              </div>
              <p className="text-xs text-muted-foreground">от 1 до 42</p>
            </div>
            <div className="space-y-4">
              <Label>Как вы себя чувствуете?</Label>
              <div className="space-y-2">
                <Slider
                  value={[feelings]}
                  onValueChange={([v]) => setFeelings(v)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm font-medium">{FEELINGS_LABELS[feelings]}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Сохранение…" : "Продолжить"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
