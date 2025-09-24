// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./app/enums/Role";
import { auth } from "./app/functions/AuthProvider";
import {
  mainMenuItems,
  footerMainMenuItems,
  footerHelpMenuItems,
  sidebarMainMenuItems,
  sidebarAdminMenuItems,
  userDropdownMenuItems,
  MenuItem,
} from "./app/constants/menuItems";

// 🔹 Helper rekursif untuk kumpulin semua url dari menu + dropdown
function collectUrls(items: MenuItem[]): { url: string; roles: Role[] }[] {
  const urls: { url: string; roles: Role[] }[] = [];

  items.forEach((item) => {
    if (item.url && item.url !== "#") {
      urls.push({ url: item.url, roles: item.roles });
    }

    if (item.dropdownMenuItems) {
      item.dropdownMenuItems.forEach((sub) => {
        urls.push({ url: sub.url, roles: sub.roles });
      });
    }
  });

  return urls;
}

// 🔹 Generate mapping role → daftar path
function buildRoleAccess(): Record<Role, string[]> {
  const allMenus = [
    ...mainMenuItems,
    ...footerMainMenuItems,
    ...footerHelpMenuItems,
    ...sidebarMainMenuItems,
    ...sidebarAdminMenuItems,
    ...Object.values(userDropdownMenuItems).flat(),
  ];

  const collected = collectUrls(allMenus);

  const access: Record<Role, string[]> = {
    [Role.GUEST]: [],
    [Role.STUDENT]: [],
    [Role.TEACHER]: [],
    [Role.ADMIN]: [],
  };

  collected.forEach(({ url, roles }) => {
    roles.forEach((r) => {
      if (!access[r].includes(url)) {
        access[r].push(url);
      }
    });
  });

  return access;
}

const roleAccess = buildRoleAccess();

export function middleware(req: NextRequest) {
  //   const user = auth.getCachedUserProfile(); // atau ambil dari cookie/session
  // 🔹 Ambil role dari cookie, bukan dari AuthProvider client
  //   const role = user?.role?.name ?? Role.GUEST;

  const roleCookie = req.cookies.get("role")?.value as Role | undefined;
  const role = roleCookie ?? Role.ADMIN;

  console.log("Role middleware: ", role);

  const url = req.nextUrl.pathname;
  const allowedPaths = roleAccess[role] || [];

  // cek akses
  if (!allowedPaths.some((path) => url.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // bagian auth masih error
    "/(auth)/(login|register)", // cocokkan login & register di group (auth)
    "/(auth)/login",
    "/(auth)/:path*",

    // sisanya aman
    "/dashboard/:path*",
    "/activity",
    "/leaderboard",
    "/profile",
    "/account-settings",
  ],
};
