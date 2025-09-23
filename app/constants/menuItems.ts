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
} from "@fortawesome/free-solid-svg-icons";
import { Role } from "../enums/Role";

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
  { menu: "Aktivitas", url: "/activity", roles: [Role.GUEST, Role.STUDENT] },
  {
    menu: "Leaderboard",
    url: "/leaderboard",
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    roles: [Role.STUDENT, Role.TEACHER],
  },
  { menu: "Tugas", url: "/dashboard/task", roles: [Role.TEACHER] },
  {
    menu: "Leaderboard Kelas",
    url: "/dashboard/leaderboard",
    roles: [Role.TEACHER],
  },
  { menu: "Dashboard", url: "/dashboard", roles: [Role.ADMIN] },
  {
    menu: "Manajemen Konten",
    url: "#",
    roles: [Role.ADMIN],
    dropdownMenuItems: [
      {
        menu: "Mata Pelajaran",
        url: "/dashboard/subject",
        icon: "/img/subject.png",
        roles: [Role.ADMIN],
      },
      {
        menu: "Materi Pelajaran",
        url: "/dashboard/material",
        icon: "/img/material.png",
        roles: [Role.ADMIN],
      },
      {
        menu: "Tugas",
        url: "/dashboard/task",
        icon: "/img/task.png",
        roles: [Role.ADMIN],
      },
      {
        menu: "Mini Game",
        url: "/dashboard/mini-game",
        icon: "/img/mini-game.png",
        roles: [Role.ADMIN],
      },
    ],
  },
];

export const userDropdownMenuItems: Record<Role, MenuItem[]> = {
  Guest: [],
  Student: [
    {
      menu: "Profil",
      url: "/profile",
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
      url: "/profile",
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
export const footerMainMenuItems: MenuItem[] = [
  { menu: "Aktivitas", url: "/activity", roles: [Role.GUEST, Role.STUDENT] },
  {
    menu: "Leaderboard",
    url: "/leaderboard",
    roles: [Role.GUEST, Role.STUDENT],
  },
  { menu: "Masuk/Daftar", url: "/login", roles: [Role.GUEST] },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Profil",
    url: "/profile",
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Keluar",
    url: "/",
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  { menu: "Tugas", url: "/dashboard/task", roles: [Role.TEACHER] },
  {
    menu: "Leaderboard Kelas",
    url: "/dashboard/leaderboard",
    roles: [Role.TEACHER],
  },
  { menu: "Dashboard", url: "/dashboard", roles: [Role.ADMIN] },
  { menu: "Pengaturan Akun", url: "/account-settings", roles: [Role.ADMIN] },
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
export const sidebarMainMenuItems: MenuItem[] = [
  { menu: "Dashboard", url: "/dashboard", icon: faHome, roles: [Role.ADMIN] },
  {
    menu: "Kelas Saya",
    url: "/dashboard/class",
    icon: faChalkboard,
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Tugas",
    url: "/dashboard/task",
    icon: faClipboardList,
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: faRankingStar,
    roles: [Role.STUDENT, Role.TEACHER],
  },
];

export const sidebarAdminMenuItems: MenuItem[] = [
  {
    menu: "Mata Pelajaran",
    url: "/dashboard/subject",
    icon: faBook,
    roles: [Role.ADMIN],
  },
  {
    menu: "Materi",
    url: "/dashboard/material",
    icon: faBookOpen,
    roles: [Role.ADMIN],
  },
  {
    menu: "Tipe Tugas",
    url: "/dashboard/task-type",
    icon: faListCheck,
    roles: [Role.ADMIN],
  },
];
