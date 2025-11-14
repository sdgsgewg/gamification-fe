let accessTokenMemory: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;
let logoutHandler: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessTokenMemory = token;
}

export function getAccessToken() {
  return accessTokenMemory;
}

export function registerRefreshHandler(fn: () => Promise<string | null>) {
  refreshHandler = fn;
}

export async function refreshAccessToken() {
  return refreshHandler ? await refreshHandler() : null;
}

export function registerLogoutHandler(fn: () => void) {
  logoutHandler = fn;
}

export function logoutSilently() {
  if (logoutHandler) logoutHandler();
}
