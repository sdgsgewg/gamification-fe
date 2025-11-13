import { NextRequest } from "next/server";

// =========================
// Set Cookie
// =========================
export const setCookie = (name: string, value: string, maxAgeMs: number) => {
  const maxAgeSeconds = Math.floor(maxAgeMs / 1000);

  const secure = process.env.NEXT_PUBLIC_COOKIE_SECURE === "true";
  const sameSite = process.env.NEXT_PUBLIC_COOKIE_SAMESITE || "lax";
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost";

  const options = [
    "path=/",
    `max-age=${maxAgeSeconds}`,
    `samesite=${sameSite}`,
    domain ? `domain=${domain}` : "",
    secure ? "secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = `${name}=${value}; ${options}`;
};

// =========================
// Get Cookie (client-side)
// =========================
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null; // server-side safety
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

// =========================
// Get Cookie (server-side / middleware)
// =========================
export const getServerCookie = (
  req: NextRequest,
  name: string
): string | null => {
  return req.cookies.get(name)?.value ?? null;
};

// =========================
// Delete Cookie
// =========================
export const deleteCookie = (name: string) => {
  const secure = process.env.NEXT_PUBLIC_COOKIE_SECURE === "true";
  const sameSite = process.env.NEXT_PUBLIC_COOKIE_SAMESITE || "lax";
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost";

  const options = [
    "path=/",
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    `samesite=${sameSite}`,
    domain ? `domain=${domain}` : "",
    secure ? "secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = `${name}=; ${options}`;
};
