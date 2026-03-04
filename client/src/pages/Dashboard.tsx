import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageCircleHeart, 
  FileText, 
  Activity, 
  ChevronRight, 
  Bell, 
  User, 
  Plus,
  Send,
  HeartPulse,
  Brain,
  UploadCloud
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import bgImage from "../assets/images/bg-abstract.png";
import aiAvatar from "../assets/images/ai-avatar.png";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const currentWeek = 22;
  const totalWeeks = 40;
  const progressPercent = (currentWeek / totalWeeks) * 100;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      {/* Background ambient image */}
      <div 
        className="absolute top-0 left-0 w-full h-[40vh] md:h-[50vh] opacity-40 mix-blend-multiply pointer-events-none"
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
        }}
      />

      <div className="container mx-auto px-4 py-6 relative z-10 max-w-6xl">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-2xl">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">Mommy AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/150?img=47" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Main) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero / Weekly Status */}
            <motion.div {...fadeIn}>
              <Card className="glass-card border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <HeartPulse className="w-32 h-32" />
                </div>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                      <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 text-sm font-medium px-3 py-1 rounded-full">
                        Второй триместр
                      </Badge>
                      <h2 className="text-4xl font-serif font-medium mb-2">22 неделя</h2>
                      <p className="text-muted-foreground text-lg">Малыш размером с папайю 🍈</p>
                    </div>
                    
                    <div className="w-full md:w-1/3 bg-white/50 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="text-primary">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-3 rounded-full bg-secondary" />
                      <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                        <span>Начало</span>
                        <span>ПДР: 14 Октября</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Check-in */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ежедневный чекап</h3>
                      <p className="text-muted-foreground text-sm">Как вы себя чувствуете сегодня?</p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {['😫', '😕', '😐', '🙂', '😊'].map((emoji, i) => (
                      <button 
                        key={i} 
                        className="flex-1 sm:flex-none text-2xl p-2 rounded-xl hover:bg-secondary transition-colors focus:ring-2 focus:ring-primary outline-none"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Assistant Chat Preview */}
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="border-border/50 shadow-sm overflow-hidden flex flex-col h-[400px]">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={aiAvatar} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">AI Ассистент</CardTitle>
                        <CardDescription>Ответит на вопросы и развеет тревоги</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">В сети</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {/* Chat Messages */}
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={aiAvatar} />
                        </Avatar>
                        <div className="bg-secondary rounded-2xl rounded-tl-none p-3 text-sm text-foreground">
                          Доброе утро, Анна! На этой неделе у нас по плану скрининг. Как ваше самочувствие? Нет ли тянущих болей?
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 max-w-[80%] ml-auto flex-row-reverse">
                         <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src="https://i.pravatar.cc/150?img=47" />
                        </Avatar>
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 text-sm">
                          Привет! Немного тянет поясницу по вечерам, это нормально?
                        </div>
                      </div>

                      <div className="flex items-start gap-3 max-w-[85%]">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={aiAvatar} />
                        </Avatar>
                        <div className="bg-secondary rounded-2xl rounded-tl-none p-3 text-sm text-foreground">
                          <p className="mb-2">Да, на 22-й неделе легкие тянущие ощущения в пояснице — это частая норма. Матка растет, смещается центр тяжести, и связки растягиваются.</p>
                          <p className="font-medium text-xs text-muted-foreground mt-2">💡 Совет: попробуйте теплый душ или коленно-локтевую позу на 10 минут. Если боль станет острой или ритмичной — обязательно напишите мне или врачу.</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <div className="p-4 bg-background border-t border-border/50">
                  <div className="relative flex items-center">
                    <Input 
                      placeholder="Задайте вопрос..." 
                      className="pr-12 rounded-full border-border/50 bg-secondary/50 focus-visible:ring-primary/50"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 h-8 w-8 text-primary hover:bg-primary/10 rounded-full">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Calendar & Tasks */}
            <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
              <Card className="border-border/50 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      План обследований
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary">
                      Весь план
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="group flex gap-4 p-3 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors">
                    <div className="flex flex-col items-center justify-center min-w-[3rem] text-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Июн</span>
                      <span className="text-xl font-serif font-bold text-primary">15</span>
                    </div>
                    <div className="border-l border-border/50 pl-4 py-1">
                      <h4 className="text-sm font-semibold mb-1">Второй скрининг (УЗИ)</h4>
                      <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> Обязательно</span>
                      </div>
                    </div>
                  </div>

                  <div className="group flex gap-4 p-3 rounded-xl border border-border/50 bg-background hover:border-primary/30 transition-colors opacity-70">
                    <div className="flex flex-col items-center justify-center min-w-[3rem] text-center">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Июн</span>
                      <span className="text-xl font-serif font-bold">20</span>
                    </div>
                    <div className="border-l border-border/50 pl-4 py-1">
                      <h4 className="text-sm font-semibold mb-1">Клинический анализ крови</h4>
                      <p className="text-xs text-muted-foreground">Натощак</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full rounded-xl border-dashed border-2 hover:bg-secondary hover:border-primary/30">
                    <Plus className="w-4 h-4 mr-2" /> Добавить событие
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Decryption */}
            <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
              <Card className="border-border/50 shadow-sm overflow-hidden group cursor-pointer relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Расшифровка анализов</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Загрузите PDF или фото результатов, и AI объяснит показатели понятным языком
                  </p>
                  <Button className="w-full rounded-full shadow-sm shadow-primary/20">
                    <UploadCloud className="w-4 h-4 mr-2" /> Загрузить результаты
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Articles / Tips */}
            <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
               <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Полезное на 22 неделе</CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-3">
                  {['Как выбрать бандаж для беременных?', 'Питание: сколько нужно кальция сейчас', 'Упражнения для снятия тонуса спины'].map((title, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-colors cursor-pointer border border-white">
                      <span className="text-sm font-medium">{title}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
               </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
