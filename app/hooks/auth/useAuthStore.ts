// useAuthStore.ts
// Manages access token (memory + sessionStorage), refresh queue and global handlers.

let accessTokenMemory: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let logoutHandler: (() => void) | null = null;

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const ACCESS_TOKEN_KEY = "app_access_token";

export function setAccessToken(token: string | null) {
  accessTokenMemory = token ?? null;

  try {
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (e) {
    // sessionStorage could throw in some environments (very rare)
    // swallow, memory token still set
  }
}

export function getAccessToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory;

  try {
    const stored = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (stored) {
      accessTokenMemory = stored;
      return stored;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export function clearAccessToken() {
  accessTokenMemory = null;
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
}

// register a function that actually performs refresh
export function registerRefreshHandler(fn: () => Promise<string | null>) {
  refreshHandler = fn;
}

// register logout handler to perform app-level cleanup
export function registerLogoutHandler(fn: () => void) {
  logoutHandler = fn;
}

export function logoutSilently() {
  try {
    clearAccessToken();
    if (logoutHandler) logoutHandler();
  } catch {}
}

/**
 * Ensures only a single refresh in-flight.
 * If a refresh is already in progress, returns a Promise that resolves once refresh finishes.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!refreshHandler) {
    return null;
  }

  if (isRefreshing) {
    // return a promise that resolves once refresh completes
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const newToken = await refreshHandler();
    // update memory/session with new token if exists
    if (newToken) setAccessToken(newToken);

    // flush queue
    refreshQueue.forEach((res) => {
      try {
        res(newToken);
      } catch {}
    });
    refreshQueue = [];

    return newToken ?? null;
  } catch (err) {
    // flush queue with null
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
