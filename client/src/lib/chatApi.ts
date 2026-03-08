/**
 * Chat API client for Mommy AI backend (mommy-ai-api).
 */

import { getStoredToken } from "@/lib/authStorage";
import { API_BASE } from "@/lib/apiBase";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface ChatResponse {
  reply: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
}

export async function getChatHistory(
  token: string,
  threadId?: string | null
): Promise<ChatHistoryResponse> {
  const url = new URL(`${API_BASE}/api/chat/history`);
  if (threadId) url.searchParams.set("thread_id", threadId);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = (data as { error?: string })?.error || res.statusText;
    throw new Error(msg);
  }
  return res.json() as Promise<ChatHistoryResponse>;
}

export async function sendChat(
  messages: ChatMessage[],
  options?: { threadId?: string | null; context?: string | null }
): Promise<ChatResponse> {
  const token = getStoredToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const body: {
    messages: { role: string; content: string }[];
    thread_id?: string;
    context?: string;
  } = {
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };
  if (options?.threadId) body.thread_id = options.threadId;
  if (options?.context) body.context = options.context;
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<ChatResponse>;
}
