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
import { getServerCookie } from "./app/utils/cookie";

// Helper rekursif untuk kumpulin semua url dari menu + dropdown
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

// Generate mapping role → daftar path
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

const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/email-verification",
  "/complete-profile",
];

const roleAccess = buildRoleAccess();

export function middleware(req: NextRequest) {
  const role = (getServerCookie(req, "role") as Role) ?? Role.GUEST;
  const url = req.nextUrl.pathname;

  console.log("Role middleware: ", role);
  console.log("Current URL =>", url);

  // Jika route termasuk auth routes -> langsung allow tanpa cek role
  if (PUBLIC_AUTH_ROUTES.includes(url)) {
    return NextResponse.next();
  }

  // Batasi url khusus admin
  if (url.startsWith("/dashboard/admin") && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Manage akses url by role user
  const allowedPaths = roleAccess[role] || [];
  const isAllowed = allowedPaths.some(
    (path) => url === path || url.startsWith(`${path}/`)
  );

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", req.url));
  }

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

// import createMiddleware from "next-intl/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { Role } from "./app/enums/Role";
// import {
//   getMainMenuItems,
//   getFooterMainMenuItems,
//   footerHelpMenuItems,
//   getSidebarMainMenuItems,
//   sidebarAdminMenuItems,
//   userDropdownMenuItems,
//   MenuItem,
// } from "./app/constants/menuItems";

// // Middleware localization
// const intlMiddleware = createMiddleware({
//   locales: ["en", "id"],
//   defaultLocale: "en",
// });

// // Helper rekursif untuk kumpulin semua url dari menu + dropdown
// function collectUrls(items: MenuItem[]): { url: string; roles: Role[] }[] {
//   const urls: { url: string; roles: Role[] }[] = [];

//   items.forEach((item) => {
//     if (item.url && item.url !== "#") {
//       urls.push({ url: item.url, roles: item.roles });
//     }

//     if (item.dropdownMenuItems) {
//       item.dropdownMenuItems.forEach((sub) => {
//         urls.push({ url: sub.url, roles: sub.roles });
//       });
//     }
//   });

//   return urls;
// }

// // Generate mapping role → daftar path
// function buildRoleAccess(): Record<Role, string[]> {
//   const roles = Object.values(Role);

//   const access: Record<Role, string[]> = {
//     [Role.GUEST]: [],
//     [Role.STUDENT]: [],
//     [Role.TEACHER]: [],
//     [Role.ADMIN]: [],
//   };

//   roles.forEach((role) => {
//     const allMenus = [
//       ...getMainMenuItems(role),
//       ...getFooterMainMenuItems(role),
//       ...footerHelpMenuItems,
//       ...getSidebarMainMenuItems(role),
//       // Hanya tambahkan sidebarAdminMenuItems kalau role-nya ADMIN
//       ...(role === Role.ADMIN ? sidebarAdminMenuItems : []),
//       // Hanya ambil dropdown sesuai role
//       ...(userDropdownMenuItems[role] || []),
//     ];

//     const collected = collectUrls(allMenus);

//     collected.forEach(({ url, roles: allowedRoles }) => {
//       if (allowedRoles.includes(role) && !access[role].includes(url)) {
//         access[role].push(url);
//       }
//     });
//   });

//   return access;
// }

// const roleAccess = buildRoleAccess();

// export function middleware(req: NextRequest) {
//   // Jalankan localization middleware lebih dulu
//   const res = intlMiddleware(req);

//   const role = (req.cookies.get("role")?.value as Role) ?? Role.GUEST;
//   const url = req.nextUrl.pathname;

//   console.log("Role middleware: ", role);
//   console.log("Current URL =>", url);

//   // Perhatikan: URL sekarang akan termasuk prefix locale (misal /en/dashboard)
//   // Maka kita bersihkan locale prefix biar mudah cek role access
//   const locale = req.nextUrl.pathname.split("/")[1];
//   const pathWithoutLocale = ["en", "id"].includes(locale)
//     ? `/${req.nextUrl.pathname.split("/").slice(2).join("/")}`
//     : url;

//   // Batasi url khusus admin
//   if (url.startsWith("/dashboard/admin") && role !== Role.ADMIN) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // Jika kamu mau aktifkan validasi path berdasarkan role:
//   const allowedPaths = roleAccess[role] || [];
//   const isAllowed = allowedPaths.some(
//     (path) =>
//       pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
//   );

//   if (!isAllowed) {
//     return NextResponse.redirect(new URL(`/${locale || "en"}`, req.url));
//   }

//   return res;
// }

// // 🌍 Config matcher harus mengizinkan prefix locale
// export const config = {
//   matcher: [
//     // Tanpa locale prefix
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/reset-password",
//     "/email-verification",
//     "/complete-profile",
//     "/dashboard/:path*",
//     "/activity",
//     "/leaderboard",
//     "/profile",
//     "/account-settings",

//     // Dengan locale prefix
//     "/en/login",
//     "/id/login",
//     "/en/register",
//     "/id/register",
//     "/en/forgot-password",
//     "/id/forgot-password",
//     "/en/reset-password",
//     "/id/reset-password",
//     "/en/email-verification",
//     "/id/email-verification",
//     "/en/complete-profile",
//     "/id/complete-profile",
//     "/en/dashboard/:path*",
//     "/id/dashboard/:path*",
//     "/en/activity",
//     "/id/activity",
//     "/en/leaderboard",
//     "/id/leaderboard",
//     "/en/profile",
//     "/id/profile",
//     "/en/account-settings",
//     "/id/account-settings",
//   ],
// };
