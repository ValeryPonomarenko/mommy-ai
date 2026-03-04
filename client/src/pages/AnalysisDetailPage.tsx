import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  MessageCircleHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getAnalysisById,
  type AnalysisStatus,
} from "@/lib/analysis";

function StatusBanner({ status, summary }: { status: AnalysisStatus; summary: string }) {
  const isNormal = status === "normal";
  const isAttention = status === "attention";
  const isAlert = status === "alert";
  const Icon = isNormal ? CheckCircle2 : isAlert ? AlertTriangle : AlertCircle;
  const bg = isNormal ? "bg-green-50 border-green-100" : isAlert ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100";
  const text = isNormal ? "text-green-800" : isAlert ? "text-red-800" : "text-amber-800";
  const iconColor = isNormal ? "text-green-600" : isAlert ? "text-red-600" : "text-amber-600";

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${bg}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
      <p className={`text-sm ${text}`}>{summary}</p>
    </div>
  );
}

interface AnalysisDetailPageProps {
  params: { id?: string };
}

export default function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const id = params?.id;
  const analysis = id ? getAnalysisById(id) : undefined;

  if (!id || !analysis) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">Анализ не найден</p>
        <Link href="/analysis">
          <Button variant="outline">К списку анализов</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans pb-12">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link href="/analysis">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
            <ChevronLeft className="w-4 h-4 mr-1" /> Назад к анализам
          </Button>
        </Link>

        <header className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold">{analysis.title}</h1>
              <p className="text-sm text-muted-foreground">{analysis.date}</p>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <StatusBanner status={analysis.status} summary={analysis.summary} />

          {analysis.hint && (
            <Card className="border-amber-100 bg-amber-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-800">
                  <Lightbulb className="w-4 h-4" />
                  Подсказка
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-900">{analysis.hint}</p>
              </CardContent>
            </Card>
          )}

          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Показатели
            </h2>
            <div className="space-y-4">
              {analysis.indicators.map((ind, i) => (
                <Card key={i} className="border-border/50">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-baseline gap-2 mb-2">
                      <span className="font-medium">{ind.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {ind.value} {ind.unit ?? ""} {ind.reference ? `(Норма ${ind.reference})` : ""}
                      </span>
                    </div>
                    {ind.percentInRange != null && (
                      <Progress
                        value={ind.percentInRange}
                        className="h-1.5 bg-secondary"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {analysis.references && analysis.references.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Источники и референсы
              </h2>
              <ul className="space-y-3">
                {analysis.references.map((ref, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium text-foreground">{ref.title}</span>
                    {ref.source && (
                      <span className="text-muted-foreground"> — {ref.source}</span>
                    )}
                    {ref.description && (
                      <p className="text-muted-foreground mt-1">{ref.description}</p>
                    )}
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs mt-1 inline-block"
                      >
                        Подробнее →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Card className="border-primary/20 bg-primary/5 overflow-hidden">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircleHeart className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Обсудить с Mommy AI</h3>
                <p className="text-sm text-muted-foreground">
                  Задайте любой вопрос по этому анализу — расшифровка, нормы, рекомендации.
                </p>
              </div>
              <Link href={`/chat?fromAnalysis=${analysis.id}`}>
                <Button className="rounded-full shadow-lg shadow-primary/20 shrink-0">
                  Обсудить с Mommy AI
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
