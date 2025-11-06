// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./app/enums/Role";

import {
  getMainMenuItems,
  getFooterMainMenuItems,
  footerHelpMenuItems,
  getSidebarMainMenuItems,
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
  const roles = Object.values(Role);

  const access: Record<Role, string[]> = {
    [Role.GUEST]: [],
    [Role.STUDENT]: [],
    [Role.TEACHER]: [],
    [Role.ADMIN]: [],
  };

  roles.forEach((role) => {
    const allMenus = [
      ...getMainMenuItems(role),
      ...getFooterMainMenuItems(role),
      ...footerHelpMenuItems,
      ...getSidebarMainMenuItems(role),
      // Hanya tambahkan sidebarAdminMenuItems kalau role-nya ADMIN
      ...(role === Role.ADMIN ? sidebarAdminMenuItems : []),
      // Hanya ambil dropdown sesuai role
      ...(userDropdownMenuItems[role] || []),
    ];

    const collected = collectUrls(allMenus);

    collected.forEach(({ url, roles: allowedRoles }) => {
      if (allowedRoles.includes(role) && !access[role].includes(url)) {
        access[role].push(url);
      }
    });
  });

  return access;
}

const roleAccess = buildRoleAccess();

export function middleware(req: NextRequest) {
  const role = (req.cookies.get("role")?.value as Role) ?? Role.GUEST;
  const url = req.nextUrl.pathname;

  console.log("Role middleware: ", role);
  console.log("Current URL =>", url);

  // Batasi url khusus admin
  if (url.startsWith("/dashboard/admin") && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // const allowedPaths = roleAccess[role] || [];
  // const isAllowed = allowedPaths.some(
  //   (path) => url === path || url.startsWith(`${path}/`)
  // );

  // if (!isAllowed) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Auth routes
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/email-verification",
    "/complete-profile",

    "/dashboard/(.*)", // cocokkan semua di bawah /dashboard
    // sisanya aman
    "/activity",
    "/leaderboard",
    "/profile",
    "/account-settings",
  ],
};
