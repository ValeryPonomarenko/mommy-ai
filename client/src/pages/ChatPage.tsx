import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft, Send, Sparkles, FileText, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAnalysisById } from "@/lib/analysis";
import { sendChat } from "@/lib/chatApi";

import aiAvatar from "../assets/images/ai-avatar.png";

type Message = { role: "user" | "assistant"; text: string };

function getFromAnalysisId(search: string): string | null {
  const params = new URLSearchParams(search);
  return params.get("fromAnalysis");
}

const INITIAL_MESSAGES: Message[] = [
  { role: "assistant", text: "Доброе утро! Я здесь, чтобы помочь вам пройти через этот путь спокойно. Как вы себя чувствуете сегодня?" },
];

export default function ChatPage() {
  const search = useSearch();
  const fromAnalysisId = useMemo(() => getFromAnalysisId(search), [search]);
  const analysis = fromAnalysisId ? getAnalysisById(fromAnalysisId) : null;

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const apiMessages = [...messages, { role: "user" as const, text }].map((m) => ({
        role: m.role,
        content: m.text,
      }));
      const { reply } = await sendChat(apiMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка отправки";
      setError(msg);
      setMessages((prev) => [...prev, { role: "assistant", text: `Ошибка: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }

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
              <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_p]:my-1.5 [&_p:first]:mt-0 [&_p:last]:mb-0 [&_strong]:font-semibold [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1]:mt-2 [&_h2]:mt-2 [&_h3]:mt-2 ${
                msg.role === 'assistant' 
                  ? 'bg-white rounded-tl-none border border-border/30' 
                  : 'bg-primary text-primary-foreground rounded-tr-none'
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={aiAvatar} />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="p-4 rounded-2xl rounded-tl-none text-sm border border-border/30 bg-white flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Печатает...</span>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {error && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}
      <footer className="p-4 border-t border-border/50 bg-white/50 backdrop-blur-md">
        <form
          className="max-w-2xl mx-auto flex gap-2"
          onSubmit={handleSubmit}
        >
          <Input 
            placeholder="Ваш вопрос..." 
            className="rounded-2xl border-border/50 bg-white/50 h-12"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
}
