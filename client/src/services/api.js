const API = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'Something went wrong. Please try again.');
  return body.data;
}
export const savedSession = (caseId) => { try { return JSON.parse(localStorage.getItem(`mystery-session-${caseId}`)); } catch { return null; } };
export const saveSession = (session) => localStorage.setItem(`mystery-session-${session.caseId}`, JSON.stringify(session));
