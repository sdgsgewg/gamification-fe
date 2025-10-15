export const isBrowser = typeof window !== "undefined";

export function getItem(key: string): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(key, value);
}

export function removeItem(key: string): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

export function clearStorage(): void {
  if (!isBrowser) return;
  window.localStorage.clear();
}

export const getToken = (): string | null => getItem("sessionToken");
