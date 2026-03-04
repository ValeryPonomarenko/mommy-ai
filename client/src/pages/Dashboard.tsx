import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageCircleHeart, 
  FileText, 
  Activity, 
  ChevronRight, 
  Bell, 
  HeartPulse,
  Plus,
  Send,
  UploadCloud,
  LayoutDashboard
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import bgImage from "../assets/images/bg-abstract.png";
import aiAvatar from "../assets/images/ai-avatar.png";

export default function Dashboard() {
  const currentWeek = 22;
  const progressPercent = (currentWeek / 40) * 100;

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
                <div className="w-full md:w-64">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="text-primary">55%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 rounded-full bg-secondary" />
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

          {/* Quick Summary Section */}
          <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="md:col-span-2 lg:col-span-3">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Вес', value: '+5.2 кг', icon: Activity, color: 'text-rose-500' },
                  { label: 'Давление', value: '110/70', icon: Activity, color: 'text-blue-500' },
                  { label: 'Настроение', value: 'Отличное', icon: Activity, color: 'text-amber-500' },
                  { label: 'Сон', value: '8.5 ч', icon: Activity, color: 'text-indigo-500' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/50 p-4 rounded-2xl border border-white/50 flex items-center gap-4">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{item.label}</p>
                      <p className="text-lg font-serif font-semibold">{item.value}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
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
