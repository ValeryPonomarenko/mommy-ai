/**
 * Chat API client for Mommy AI backend (mommy-ai-api).
 */

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: { VITE_CHAT_API_URL?: string } }).env?.VITE_CHAT_API_URL) ||
  "https://api.yacloud.mindoo.space";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface ChatResponse {
  reply: string;
}

export async function sendChat(messages: ChatMessage[]): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<ChatResponse>;
}
