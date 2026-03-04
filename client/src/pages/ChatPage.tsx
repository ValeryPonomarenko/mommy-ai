import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Send, Sparkles, FileText } from "lucide-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAnalysisById } from "@/lib/analysis";

import aiAvatar from "../assets/images/ai-avatar.png";

function getFromAnalysisId(search: string): string | null {
  const params = new URLSearchParams(search);
  return params.get("fromAnalysis");
}

export default function ChatPage() {
  const search = useSearch();
  const fromAnalysisId = useMemo(() => getFromAnalysisId(search), [search]);
  const analysis = fromAnalysisId ? getAnalysisById(fromAnalysisId) : null;

  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Доброе утро! Я здесь, чтобы помочь вам пройти через этот путь спокойно. Как вы себя чувствуете сегодня?' },
    { role: 'user', text: 'Привет! Иногда чувствую, как малыш толкается, это так необычно.' },
    { role: 'assistant', text: 'Это прекрасные новости! Первые шевеления обычно ощущаются как «бабочки» или легкие пузырьки. На 22-й неделе они становятся более отчетливыми.' }
  ]);

  return (
    <div className="h-screen bg-background flex flex-col font-sans">
      <header className="px-4 py-4 border-b border-border/50 flex items-center justify-between glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={aiAvatar} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-sm font-bold">Mommy AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Онлайн</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
          <Sparkles className="w-5 h-5" />
        </Button>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-4">
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground truncate">
                  Обсуждаете анализ: <span className="font-medium text-foreground">{analysis.title}</span>
                </span>
              </div>
              <Link href={`/analysis/${analysis.id}`}>
                <Button variant="ghost" size="sm" className="shrink-0 text-primary">
                  К анализу
                </Button>
              </Link>
            </motion.div>
          )}
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={msg.role === 'assistant' ? aiAvatar : "https://i.pravatar.cc/150?img=47"} />
              </Avatar>
              <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-white rounded-tl-none border border-border/30' 
                  : 'bg-primary text-primary-foreground rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <footer className="p-4 border-t border-border/50 bg-white/50 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input 
            placeholder="Ваш вопрос..." 
            className="rounded-2xl border-border/50 bg-white/50 h-12"
          />
          <Button className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/20">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
