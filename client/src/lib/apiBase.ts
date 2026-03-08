/**
 * API base URL: production → api.yacloud.mindoo.space, otherwise localhost:8080.
 * Override with VITE_CHAT_API_URL in .env if needed.
 */

const env = typeof import.meta !== "undefined" ? (import.meta as unknown as { env?: { VITE_CHAT_API_URL?: string; MODE?: string; PROD?: boolean } }).env : undefined;
const explicit = env?.VITE_CHAT_API_URL;
const isProduction = env?.PROD === true;

export const API_BASE =
  explicit ||
  (isProduction ? "https://api.yacloud.mindoo.space" : "http://localhost:8080");
