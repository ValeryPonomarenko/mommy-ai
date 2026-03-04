import { motion } from "framer-motion";
import { ChevronLeft, Calendar as CalendarIcon, Plus, Brain } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-background font-sans pb-10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-primary">
            <ChevronLeft className="w-4 h-4 mr-1" /> Назад
          </Button>
        </Link>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-medium">Календарь</h1>
          <Button size="icon" className="rounded-full shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Предстоящие события</h2>
            <div className="space-y-4">
              {[
                { date: '15 Июн', title: 'Второй скрининг (УЗИ)', type: 'Обязательно', detail: 'Проверка органов и систем малыша', icon: Brain, color: 'text-primary' },
                { date: '20 Июн', title: 'Клинический анализ крови', type: 'Анализ', detail: 'Сдать натощак до 10:00', icon: CalendarIcon, color: 'text-blue-500' },
                { date: '05 Июл', title: 'Прием гинеколога', type: 'Визит', detail: 'Обсуждение результатов скрининга', icon: CalendarIcon, color: 'text-orange-500' },
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  key={i}
                >
                  <Card className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex gap-6">
                      <div className="flex flex-col items-center justify-center min-w-[3.5rem] py-2 bg-secondary/50 rounded-2xl">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{item.date.split(' ')[1]}</span>
                        <span className="text-2xl font-serif font-bold text-foreground">{item.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase">{item.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
