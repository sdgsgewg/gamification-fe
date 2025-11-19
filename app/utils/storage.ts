// src/utils/storage.ts
// Small storage helpers: localStorage (for non-auth persistent flags) + sessionStorage (for auth cache).
// Also keep old alias functions (getItem, setItem, clearStorage) for minimal compatibility.

export const setLocal = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore quota errors silently
    console.warn("setLocal error", e);
  }
};

export const getLocal = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const removeLocal = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
};

export const clearLocal = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch {}
};

export const setSession = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.warn("setSession error", e);
  }
};

export const getSession = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const removeSession = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.clear();
  } catch {}
};

// Clear both storages (used on logout / forced cleanup)
export const clearStorage = () => {
  clearSession();
  clearLocal();
};

export const getCachedAuth = (key: string): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const s = sessionStorage.getItem(key);
    if (s) return s;
  } catch {}

  try {
    const l = localStorage.getItem(key);
    if (l) return l;
  } catch {}

  return null;
};

/*
  Backwards-compatible aliases (existing code used getItem/setItem/clearStorage).
  getItem / setItem map to localStorage helpers (for flags like firstTimeUser).
*/
export const setItem = setLocal;
export const getItem = getLocal;
export { clearStorage as clearAllStorage }; // explicit export if you want the name
