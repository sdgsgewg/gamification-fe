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
  faFileArrowUp,
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
    menu: "Activity",
    url: ROUTES.ROOT.ACTIVITY,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Leaderboard",
    url: ROUTES.ROOT.LEADERBOARD,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Dashboard",
    url: ROUTES.DASHBOARD.BASE,
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "My Class",
    url: resolveDashboardRoute(role, "/class"),
    roles: [Role.STUDENT, Role.TEACHER],
  },
  { menu: "Task", url: ROUTES.DASHBOARD.TEACHER.TASKS, roles: [Role.TEACHER] },
  {
    menu: "Content Management",
    url: "#",
    roles: [Role.ADMIN],
    dropdownMenuItems: [
      {
        menu: "Subject",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS,
        icon: IMAGES.SUBJECT,
        roles: [Role.ADMIN],
      },
      {
        menu: "Material",
        url: ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS,
        icon: IMAGES.MATERIAL,
        roles: [Role.ADMIN],
      },
      {
        menu: "Task",
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
      menu: "History",
      url: ROUTES.ROOT.HISTORY,
      icon: faClockRotateLeft,
      roles: [Role.STUDENT],
    },
    {
      menu: "Profile",
      url: "",
      dynamicPath: (username: string) => `/users/${username}`,
      icon: faUser,
      roles: [Role.STUDENT],
    },
  ],
  Teacher: [
    {
      menu: "Profile",
      url: "",
      dynamicPath: (username: string) => `/users/${username}`,
      icon: faUser,
      roles: [Role.TEACHER],
    },
  ],
  Admin: [
    // {
    //   menu: "Account Settings",
    //   url: "/account-settings",
    //   icon: faGear,
    //   roles: [Role.ADMIN],
    // },
  ],
};

// FOOTER (Main Layout)
export const getFooterMainMenuItems = (role: Role): MenuItem[] => [
  {
    menu: "Activity",
    url: ROUTES.ROOT.ACTIVITY,
    roles: [Role.GUEST, Role.STUDENT],
  },
  {
    menu: "Leaderboard",
    url: ROUTES.ROOT.LEADERBOARD,
    roles: [Role.GUEST, Role.STUDENT],
  },
  { menu: "Log In/Register", url: ROUTES.AUTH.LOGIN, roles: [Role.GUEST] },
  {
    menu: "My Class",
    url: resolveDashboardRoute(role, "/class"),
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Profile",
    url: "",
    dynamicPath: (username: string) => `/users/${username}`,
    roles: [Role.STUDENT, Role.TEACHER],
  },
  { menu: "Task", url: ROUTES.DASHBOARD.TEACHER.TASKS, roles: [Role.TEACHER] },
  { menu: "Dashboard", url: ROUTES.DASHBOARD.ADMIN.HOME, roles: [Role.ADMIN] },
  // { menu: "Manage Account", url: "/account-settings", roles: [Role.ADMIN] },
  {
    menu: "Log Out",
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
    menu: "Contact Us",
    url: "/contact-us",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Privacy",
    url: "/privacy",
    roles: [Role.GUEST, Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Terms & Conditions",
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
    menu: "My Class",
    url: resolveDashboardRoute(role, "/class"),
    icon: faChalkboard,
    roles: [Role.STUDENT, Role.TEACHER],
  },
  {
    menu: "Task",
    url: resolveDashboardRoute(role, "/tasks"),
    icon: faClipboardList,
    roles: [Role.STUDENT, Role.TEACHER, Role.ADMIN],
  },
  {
    menu: "Submissions",
    url: resolveDashboardRoute(role, "/submissions"),
    icon: faFileArrowUp,
    roles: [Role.TEACHER],
  },
  {
    menu: "Leaderboard",
    url: ROUTES.DASHBOARD.LEADERBOARD,
    icon: faRankingStar,
    roles: [Role.STUDENT, Role.TEACHER],
  },
];

export const sidebarAdminMenuItems: MenuItem[] = [
  {
    menu: "Subject",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_SUBJECTS,
    icon: faBook,
    roles: [Role.ADMIN],
  },
  {
    menu: "Material",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_MATERIALS,
    icon: faBookOpen,
    roles: [Role.ADMIN],
  },
  {
    menu: "Task Type",
    url: ROUTES.DASHBOARD.ADMIN.MANAGE_TASK_TYPES,
    icon: faListCheck,
    roles: [Role.ADMIN],
  },
];
