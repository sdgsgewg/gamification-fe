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
} from "@fortawesome/free-solid-svg-icons";

export type Role = "guest" | "student" | "teacher" | "admin";

export interface MenuItem {
  menu: string;
  url: string;
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
export const mainMenuItems: MenuItem[] = [
  { menu: "Aktivitas", url: "/activity", roles: ["guest", "student"] },
  { menu: "Leaderboard", url: "/leaderboard", roles: ["guest", "student"] },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    roles: ["student", "teacher"],
  },
  { menu: "Tugas", url: "/dashboard/task", roles: ["teacher"] },
  {
    menu: "Leaderboard Kelas",
    url: "/dashboard/leaderboard",
    roles: ["teacher"],
  },
  { menu: "Dashboard", url: "/dashboard", roles: ["admin"] },
  {
    menu: "Manajemen Konten",
    url: "#",
    roles: ["admin"],
    dropdownMenuItems: [
      {
        menu: "Mata Pelajaran",
        url: "/dashboard/subject",
        icon: "/img/subject.png",
        roles: ["admin"],
      },
      {
        menu: "Materi Pelajaran",
        url: "/dashboard/material",
        icon: "/img/material.png",
        roles: ["admin"],
      },
      {
        menu: "Tugas",
        url: "/dashboard/task",
        icon: "/img/task.png",
        roles: ["admin"],
      },
      {
        menu: "Mini Game",
        url: "/dashboard/mini-game",
        icon: "/img/mini-game.png",
        roles: ["admin"],
      },
    ],
  },
];

export const userDropdownMenuItems: Record<Role, MenuItem[]> = {
  guest: [],
  student: [
    {
      menu: "Profil",
      url: "/profile",
      icon: faUser,
      roles: ["student"],
    },
    {
      menu: "Keluar",
      url: "/logout",
      icon: faRightFromBracket,
      roles: ["student"],
    },
  ],
  teacher: [
    {
      menu: "Profil",
      url: "/profile",
      icon: faUser,
      roles: ["teacher"],
    },
    {
      menu: "Keluar",
      url: "/logout",
      icon: faRightFromBracket,
      roles: ["teacher"],
    },
  ],
  admin: [
    {
      menu: "Pengaturan Akun",
      url: "/account-settings",
      icon: faGear,
      roles: ["admin"],
    },
    {
      menu: "Keluar",
      url: "/logout",
      icon: faRightFromBracket,
      roles: ["admin"],
    },
  ],
};

// FOOTER (Main Layout)
export const footerMainMenuItems: MenuItem[] = [
  { menu: "Aktivitas", url: "/activity", roles: ["guest", "student"] },
  { menu: "Leaderboard", url: "/leaderboard", roles: ["guest", "student"] },
  { menu: "Masuk/Daftar", url: "/login", roles: ["guest"] },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    roles: ["student", "teacher"],
  },
  {
    menu: "Profil",
    url: "/profile",
    roles: ["student", "teacher"],
  },
  {
    menu: "Keluar",
    url: "#",
    roles: ["student", "teacher", "admin"],
  },
  { menu: "Tugas", url: "/dashboard/task", roles: ["teacher"] },
  {
    menu: "Leaderboard Kelas",
    url: "/dashboard/leaderboard",
    roles: ["teacher"],
  },
  { menu: "Dashboard", url: "/dashboard", roles: ["admin"] },
  { menu: "Pengaturan Akun", url: "/account-settings", roles: ["admin"] },
];

export const footerHelpMenuItems: MenuItem[] = [
  { menu: "FAQ", url: "/faq", roles: ["guest", "student", "teacher", "admin"] },
  {
    menu: "Kontak Kami",
    url: "/contact-us",
    roles: ["guest", "student", "teacher", "admin"],
  },
  {
    menu: "Privasi",
    url: "/privacy",
    roles: ["guest", "student", "teacher", "admin"],
  },
  {
    menu: "Syarat & Ketentuan",
    url: "/terms-and-conditions",
    roles: ["guest", "student", "teacher", "admin"],
  },
];

// SIDEBAR (Dashboard Layout)
export const sidebarMainMenuItems: MenuItem[] = [
  { menu: "Dashboard", url: "/dashboard", icon: faHome, roles: ["admin"] },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    icon: faChalkboard,
    roles: ["student", "teacher"],
  },
  {
    menu: "Tugas",
    url: "/dashboard/task",
    icon: faClipboardList,
    roles: ["student", "teacher", "admin"],
  },
  {
    menu: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: faRankingStar,
    roles: ["student", "teacher"],
  },
];

export const sidebarAdminMenuItems: MenuItem[] = [
  {
    menu: "Mata Pelajaran",
    url: "/dashboard/subject",
    icon: faBook,
    roles: ["admin"],
  },
  {
    menu: "Materi",
    url: "/dashboard/material",
    icon: faBookOpen,
    roles: ["admin"],
  },
];
