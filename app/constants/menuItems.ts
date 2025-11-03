import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faRightFromBracket,
  faGear,
  faChalkboard,
  faRankingStar,
  faClipboardList,
  faHome,
  faBook,
  faBookOpen,
  faListCheck,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Role } from "../enums/Role";
import { ROUTES } from "./routes";
import { IMAGES } from "./images";
import { resolveDashboardRoute } from "./resolveRoute";

export interface MenuItem {
  menu: string;
  url: string;
  dynamicPath?: (text: string) => string;
  icon?: IconDefinition;
  roles: Role[];
  isShownOnFooter?: boolean;
  dropdownMenuItems?: {
    menu: string;
    url: string;
    icon?: string;
    roles: Role[];
  }[];
}

// HEADER (Main Layout)
export const getMainMenuItems = (role: Role): MenuItem[] => [
  {
    menu: "Aktivitas",
    url: ROUTES.ROOT.ACTIVITY,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Leaderboard",
    url: ROUTES.ROOT.LEADERBOARD,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Kelas Saya",
    url: resolveDashboardRoute(role, "/class"),
    roles: [Role.STUDENT, Role.TEACHER],
  },
  { menu: "Tugas", url: ROUTES.DASHBOARD.TEACHER.TASKS, roles: [Role.TEACHER] },
  {
    menu: "Leaderboard Kelas",
    url: ROUTES.DASHBOARD.TEACHER.LEADERBOARD,
    roles: [Role.TEACHER],
  },
  { menu: "Dashboard", url: ROUTES.DASHBOARD.ADMIN.HOME, roles: [Role.ADMIN] },
  {
    menu: "Manajemen Konten",
    url: "#",
    roles: [Role.ADMIN],
    dropdownMenuItems: [
      {
        menu: "Mata Pelajaran",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS,
        icon: IMAGES.SUBJECT,
        roles: [Role.ADMIN],
      },
      {
        menu: "Materi Pelajaran",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS,
        icon: IMAGES.MATERIAL,
        roles: [Role.ADMIN],
      },
      {
        menu: "Tugas",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_TASKS,
        icon: IMAGES.TASK,
        roles: [Role.ADMIN],
      },
      {
        menu: "Mini Game",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_MINI_GAMES,
        icon: IMAGES.MINI_GAME,
        roles: [Role.ADMIN],
      },
    ],
  },
];

export const userDropdownMenuItems: Record<Role, MenuItem[]> = {
  Guest: [],
  Student: [
    {
      menu: "Riwayat",
      url: ROUTES.ROOT.HISTORY,
      icon: faClockRotateLeft,
      roles: [Role.STUDENT],
    },
    {
      menu: "Profil",
      url: "",
      dynamicPath: (username: string) => `/users/${username}`,
      icon: faUser,
      roles: [Role.STUDENT],
    },
    {
      menu: "Keluar",
      url: "/",
      icon: faRightFromBracket,
      roles: [Role.STUDENT],
    },
  ],
  Teacher: [
    {
      menu: "Profil",
      url: "",
      dynamicPath: (username: string) => `/users/${username}`,
      icon: faUser,
      roles: [Role.TEACHER],
    },
    {
      menu: "Keluar",
      url: "/",
      icon: faRightFromBracket,
      roles: [Role.TEACHER],
    },
  ],
  Admin: [
    {
      menu: "Pengaturan Akun",
      url: "/account-settings",
      icon: faGear,
      roles: [Role.ADMIN],
    },
    {
      menu: "Keluar",
      url: "/",
      icon: faRightFromBracket,
      roles: [Role.ADMIN],
    },
  ],
};

// FOOTER (Main Layout)
export const getFooterMainMenuItems = (role: Role): MenuItem[] => [
  {
    menu: "Aktivitas",
    url: ROUTES.ROOT.ACTIVITY,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Leaderboard",
    url: ROUTES.ROOT.LEADERBOARD,
    roles: [Role.GUEST, Role.STUDENT],
  },
  { menu: "Masuk/Daftar", url: ROUTES.AUTH.LOGIN, roles: [Role.GUEST] },
  {
    menu: "Kelas Saya",
    url: resolveDashboardRoute(role, "/class"),
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Profil",
    url: "",
    dynamicPath: (username: string) => `/users/${username}`,
    roles: [Role.STUDENT, Role.TEACHER],
  },
  { menu: "Tugas", url: ROUTES.DASHBOARD.TEACHER.TASKS, roles: [Role.TEACHER] },
  {
    menu: "Leaderboard Kelas",
    url: ROUTES.DASHBOARD.TEACHER.LEADERBOARD,
    roles: [Role.TEACHER],
  },
  { menu: "Dashboard", url: ROUTES.DASHBOARD.ADMIN.HOME, roles: [Role.ADMIN] },
  { menu: "Pengaturan Akun", url: "/account-settings", roles: [Role.ADMIN] },
  {
    menu: "Keluar",
    url: "/",
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
];

export const footerHelpMenuItems: MenuItem[] = [
  {
    menu: "FAQ",
    url: "/faq",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Kontak Kami",
    url: "/contact-us",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Privasi",
    url: "/privacy",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Syarat & Ketentuan",
    url: "/terms-and-conditions",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
];

// SIDEBAR (Dashboard Layout)
export const getSidebarMainMenuItems = (role: Role): MenuItem[] => [
  {
    menu: "Dashboard",
    url: resolveDashboardRoute(role),
    icon: faHome,
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Kelas Saya",
    url: resolveDashboardRoute(role, "/class"),
    icon: faChalkboard,
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Tugas",
    url: resolveDashboardRoute(role, "/tasks"),
    icon: faClipboardList,
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Leaderboard",
    url: resolveDashboardRoute(role, "/leaderboard"),
    icon: faRankingStar,
    roles: [Role.STUDENT, Role.TEACHER],
  },
];

export const sidebarAdminMenuItems: MenuItem[] = [
  {
    menu: "Mata Pelajaran",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS,
    icon: faBook,
    roles: [Role.ADMIN],
  },
  {
    menu: "Materi",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS,
    icon: faBookOpen,
    roles: [Role.ADMIN],
  },
  {
    menu: "Tipe Tugas",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES,
    icon: faListCheck,
    roles: [Role.ADMIN],
  },
];
