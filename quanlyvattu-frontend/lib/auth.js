const SESSION_KEY = 'wm_materials_session';
const COOKIE_KEY = 'wm_materials_token';

export function getStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  document.cookie = `${COOKIE_KEY}=${session?.accessToken || ''}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
  document.cookie = `${COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}
