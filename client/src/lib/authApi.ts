/**
 * Auth API client (register, login, me, onboarding).
 * Uses same base URL as chatApi (apiBase).
 */

import { API_BASE } from "@/lib/apiBase";

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export interface MeResponse {
  user: { id: string; email: string };
  profile?: { pregnancy_week: number; feelings: number };
}

export interface OnboardingBody {
  pregnancy_week: number;
  feelings: number;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = (data as { error?: string })?.error || res.statusText;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("POST", "/api/register", { email, password });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("POST", "/api/login", { email, password });
}

export async function getMe(token: string): Promise<MeResponse> {
  return request<MeResponse>("GET", "/api/me", undefined, token);
}

export async function putOnboarding(
  token: string,
  data: OnboardingBody
): Promise<OnboardingBody> {
  return request<OnboardingBody>("PUT", "/api/me/onboarding", data, token);
}
