// useAuthStore.ts
// Manages access token (memory + sessionStorage + localStorage), refresh queue and global handlers.

let accessTokenMemory: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let logoutHandler: (() => void) | null = null;

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const ACCESS_TOKEN_KEY = "app_access_token";

// -----------------------------------------------------------
// Set Access Token (memory + sessionStorage + localStorage)
// -----------------------------------------------------------
export function setAccessToken(token: string | null) {
  accessTokenMemory = token ?? null;

  try {
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
        localStorage.setItem(ACCESS_TOKEN_KEY, token); // persistent copy
      } else {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  } catch (e) {
    console.warn("setAccessToken storage error", e);
  }
}

// -----------------------------------------------------------
// Get Access Token (memory → sessionStorage → localStorage)
// -----------------------------------------------------------
export function getAccessToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory;

  if (typeof window === "undefined") return null;

  try {
    const session = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (session) {
      accessTokenMemory = session;
      return session;
    }

    const local = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (local) {
      accessTokenMemory = local;

      // restore to sessionStorage for tab isolation behavior
      try {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, local);
      } catch {}

      return local;
    }
  } catch (e) {
    console.warn("getAccessToken error", e);
  }

  return null;
}

// -----------------------------------------------------------
// Clear Access Token From All Storages
// -----------------------------------------------------------
export function clearAccessToken() {
  accessTokenMemory = null;

  try {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch {}
}

// Handlers registration
export function registerRefreshHandler(fn: () => Promise<string | null>) {
  refreshHandler = fn;
}

export function registerLogoutHandler(fn: () => void) {
  logoutHandler = fn;
}

export function logoutSilently() {
  try {
    clearAccessToken();
    logoutHandler?.();
  } catch {}
}

// -----------------------------------------------------------
// Refresh Queue (anti-double-refresh logic)
// -----------------------------------------------------------
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshHandler) return null;

  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve));
  }

  isRefreshing = true;

  try {
    const newToken = await refreshHandler();

    if (newToken) {
      setAccessToken(newToken);
    }

    // Resolve queued requests
    refreshQueue.forEach((res) => {
      try {
        res(newToken);
      } catch {}
    });
    refreshQueue = [];

    return newToken ?? null;
  } catch (err) {
    // Flush queue with null on error
    refreshQueue.forEach((res) => {
      try {
        res(null);
      } catch {}
    });
    refreshQueue = [];

    return null;
  } finally {
    isRefreshing = false;
  }
}
