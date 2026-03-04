import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageCircleHeart, 
  FileText, 
  ChevronRight, 
  Bell, 
  HeartPulse,
  UploadCloud,
  LayoutDashboard,
  Scale,
  Heart,
  Smile,
  Moon,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getFetalSizeByWeek, formatFetalWeight, formatFetalLength } from "@/lib/fetalSize";
import {
  getLatestWeight,
  getLatestPressure,
  getLatestMood,
  getLatestSleep,
  formatMetricValue,
  METRIC_CONFIG,
  type MetricSlug,
} from "@/lib/healthMetrics";
import { QuickLogDrawer } from "@/components/QuickLogDrawer";

import bgImage from "../assets/images/bg-abstract.png";

const DASHBOARD_METRICS: { slug: MetricSlug; icon: typeof Scale; bg: string }[] = [
  { slug: "weight", icon: Scale, bg: "from-rose-500/15 to-rose-500/5" },
  { slug: "pressure", icon: Heart, bg: "from-blue-500/15 to-blue-500/5" },
  { slug: "mood", icon: Smile, bg: "from-amber-500/15 to-amber-500/5" },
  { slug: "sleep", icon: Moon, bg: "from-indigo-500/15 to-indigo-500/5" },
];

function getLatestForSlug(slug: MetricSlug): string {
  switch (slug) {
    case "weight":
      return formatMetricValue("weight", getLatestWeight());
    case "pressure":
      return formatMetricValue("pressure", getLatestPressure());
    case "mood":
      return formatMetricValue("mood", getLatestMood());
    case "sleep":
      return formatMetricValue("sleep", getLatestSleep());
    default:
      return "—";
  }
}

export default function Dashboard() {
  const currentWeek = 22;
  const fetalSize = getFetalSizeByWeek(currentWeek);
  const [quickLogMetric, setQuickLogMetric] = useState<MetricSlug | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans pb-20">
      <div 
        className="absolute top-0 left-0 w-full h-[40vh] opacity-30 mix-blend-multiply pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
        }}
      />

      <div className="container mx-auto px-4 py-6 relative z-10 max-w-6xl">
        <header className="flex justify-between items-center mb-10">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary/20 p-2 rounded-2xl">
                <HeartPulse className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">Mommy AI</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://i.pravatar.cc/150?img=47" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Status */}
          <motion.div {...fadeIn} className="md:col-span-2 lg:col-span-3">
            <Card className="glass-card border-none overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <Badge className="mb-4 bg-primary/10 text-primary border-none px-4 py-1 rounded-full">22-я неделя • Второй триместр</Badge>
                  <h2 className="text-4xl font-serif font-medium mb-2">Ваш малыш растет</h2>
                  <p className="text-muted-foreground">Сейчас он размером с папайю. Все идет по плану!</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center md:text-left">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider mb-0.5">Вес малыша</p>
                    <p className="text-xl font-serif font-semibold text-primary">{formatFetalWeight(fetalSize.weightG)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider mb-0.5">Рост</p>
                    <p className="text-xl font-serif font-semibold text-primary">{formatFetalLength(fetalSize.lengthCm)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Access: AI Chat Bot */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <Link href="/chat">
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <MessageCircleHeart className="w-6 h-6" />
                  </div>
                  <CardTitle>Чат с AI</CardTitle>
                  <CardDescription>Задайте любой вопрос или поделитесь симптомами</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Начать диалог <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* Quick Access: Analysis Upload */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <Link href="/analysis">
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <CardTitle>Анализы</CardTitle>
                  <CardDescription>Загрузите PDF для мгновенной расшифровки</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center text-blue-600 font-medium text-sm">
                    Загрузить файл <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* Quick Access: Calendar */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <Link href="/calendar">
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <CardTitle>Календарь</CardTitle>
                  <CardDescription>Ближайшее событие: 15 июня — Второй скрининг</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center text-orange-600 font-medium text-sm">
                    Открыть план <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* Metrics: tap to quick-log */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="md:col-span-2 lg:col-span-3">
             <div className="grid grid-cols-2 gap-3" key={refreshKey}>
                {DASHBOARD_METRICS.map(({ slug, icon: Icon, bg }) => {
                  const config = METRIC_CONFIG[slug];
                  const value = getLatestForSlug(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setQuickLogMetric(slug)}
                      className={`rounded-2xl border border-white/60 bg-gradient-to-br ${bg} p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20`}
                    >
                      <Icon className={`w-6 h-6 ${config.color} mb-2`} />
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider truncate">
                        {config.label}
                      </p>
                      <p className="text-lg font-semibold truncate mt-0.5">{value}</p>
                    </button>
                  );
                })}
             </div>
             <p className="text-xs text-muted-foreground text-center mt-2">Нажмите, чтобы записать</p>
          </motion.div>

          <QuickLogDrawer
            metric={quickLogMetric}
            open={quickLogMetric !== null}
            onOpenChange={(open) => !open && setQuickLogMetric(null)}
            onLogged={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>

      {/* Bottom Navigation for Mobile Feel */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border/50 px-6 py-3 flex justify-between items-center z-50 max-w-2xl mx-auto rounded-t-3xl md:hidden">
         <Link href="/"><LayoutDashboard className="w-6 h-6 text-primary" /></Link>
         <Link href="/chat"><MessageCircleHeart className="w-6 h-6 text-muted-foreground" /></Link>
         <Link href="/analysis"><FileText className="w-6 h-6 text-muted-foreground" /></Link>
         <Link href="/calendar"><Calendar className="w-6 h-6 text-muted-foreground" /></Link>
      </nav>
    </div>
  );
}
