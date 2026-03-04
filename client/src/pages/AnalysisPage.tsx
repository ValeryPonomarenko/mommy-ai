import { motion } from "framer-motion";
import { ChevronLeft, UploadCloud, FileText, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllAnalyses } from "@/lib/analysis";

export default function AnalysisPage() {
  const analyses = getAllAnalyses();

  return (
    <div className="min-h-screen bg-background font-sans pb-10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
            <ChevronLeft className="w-4 h-4 mr-1" /> Назад
          </Button>
        </Link>
        
        <h1 className="text-3xl font-serif font-medium mb-2">Анализы</h1>
        <p className="text-muted-foreground mb-8">Загрузите результаты исследований для расшифровки</p>

        <div className="space-y-8">
          {/* Upload Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl p-12 flex flex-col items-center text-center group cursor-pointer hover:bg-primary/10 transition-colors">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Выберите файл</h3>
              <p className="text-sm text-muted-foreground mb-6">PDF, JPEG или PNG до 10 МБ</p>
              <Button className="rounded-full px-8 shadow-lg shadow-primary/10">Выбрать на устройстве</Button>
            </div>
          </motion.div>

          {/* Last Results */}
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Последние расшифровки</h2>
            <div className="space-y-4">
              {analyses.map((a) => {
                const isNormal = a.status === "normal";
                const isAttention = a.status === "attention";
                const Icon = isNormal ? CheckCircle2 : AlertCircle;
                const summaryBg = isNormal ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100";
                const summaryText = isNormal ? "text-green-800" : "text-amber-800";
                const iconColor = isNormal ? "text-green-600" : "text-amber-600";
                const iconBg = isNormal ? "text-blue-500" : "text-purple-500";
                return (
                  <Link key={a.id} href={`/analysis/${a.id}`}>
                    <Card className="border-border/50 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className={`w-5 h-5 ${iconBg}`} />
                          <CardTitle className="text-base">{a.title}</CardTitle>
                        </div>
                        <span className="text-xs text-muted-foreground">{a.dateShort}</span>
                      </CardHeader>
                      <CardContent>
                        <div className={`rounded-xl border p-3 flex items-start gap-3 mb-4 ${summaryBg}`}>
                          <Icon className={`w-4 h-4 mt-0.5 ${iconColor}`} />
                          <p className={`text-xs ${summaryText}`}>{a.summary}</p>
                        </div>
                        {a.indicators.length > 0 && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium">{a.indicators[0].name}</span>
                                <span className="text-muted-foreground">
                                  {a.indicators[0].value} {a.indicators[0].unit ?? ""} {a.indicators[0].reference ? `(Норма ${a.indicators[0].reference})` : ""}
                                </span>
                              </div>
                              {a.indicators[0].percentInRange != null && (
                                <Progress value={a.indicators[0].percentInRange} className="h-1 bg-secondary" />
                              )}
                            </div>
                          </div>
                        )}
                        <div className="mt-3 flex items-center text-primary font-medium text-sm">
                          Подробнее <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
