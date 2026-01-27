export const ROUTES = {
  // 🔐 Auth
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    EMAIL_VERIFICATION: "/email-verification",
    COMPLETE_PROFILE: "/complete-profile",
  },

  // 🏠 Root
  ROOT: {
    HOME: "/",
    ABOUT: "/about",
    SUBJECTS: "/subjects",
    BADGES: "/badges",
    ACTIVITY: "/activities",
    ACTIVITYSECTION: "/activities/sections",
    LEADERBOARD: "/leaderboard",
    HISTORY: "/history",
    PROFILE: "/users",
  },

  // 🎓 Dashboard
  DASHBOARD: {
    BASE: "/dashboard",
    LEADERBOARD: "/dashboard/leaderboard",

    // 👩‍🎓 Student
    STUDENT: {
      BASE: "/dashboard/student",
      HOME: "/dashboard/student",
      CLASS: "/dashboard/student/class",
      TASKS: "/dashboard/student/tasks",
      TASKS_VIEW: "/dashboard/student/tasks/view",
      TASKS_ATTEMPT: "/dashboard/student/tasks/attempt",
      SUBMISSIONS: "/dashboard/student/submissions",
      ANALYTICS: "/dashboard/student/analytics",
    },

    // 👨‍🏫 Teacher
    TEACHER: {
      BASE: "/dashboard/teacher",
      HOME: "/dashboard/teacher",
      CLASS: "/dashboard/teacher/class",
      TASKS: "/dashboard/teacher/tasks",
      SUBMISSIONS: "/dashboard/teacher/submissions",
      ANALYTICS: "/dashboard/teacher/analytics",
    },

    // 🧑‍💼 Admin
    ADMIN: {
      BASE: "/dashboard/admin",
      HOME: "/dashboard/admin",
      MANAGE_SUBJECTS: "/dashboard/admin/manage-subjects",
      MANAGE_MATERIALS: "/dashboard/admin/manage-materials",
      MANAGE_TASKS: "/dashboard/admin/manage-tasks",
      MANAGE_TASK_TYPES: "/dashboard/admin/manage-task-types",
      MANAGE_MINI_GAMES: "/dashboard/admin/manage-mini-games",
      ANALYTICS: "/dashboard/admin/analytics",
    },
  },
};
