"use client";

import React, { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faBars,
  faXmark,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Role } from "@/app/enums/Role";
import { ROUTES } from "@/app/constants/routes";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import ThemeSwitcher from "../../shared/ThemeSwitcher";
import {
  getMainMenuItems,
  userDropdownMenuItems,
  MenuItem,
} from "@/app/constants/menuItems";
import { useUserStats } from "@/app/hooks/users/useUserStats";
import { useAuth } from "@/app/hooks/auth/useAuth";

const MainMenuItem = ({ url, menu }: { url: string; menu: string }) => (
  <li className="text-dark">
    <a href={url}>{menu}</a>
  </li>
);

const MainMenuItemWrapper = ({
  role,
  isMobile = false,
}: {
  role: Role;
  isMobile?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const filteredItems = getMainMenuItems(role).filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul
      className={`flex ${isMobile ? "flex-col gap-4" : "items-center gap-6"}`}
    >
      {filteredItems.map((item) =>
        item.dropdownMenuItems ? (
          <li key={item.menu}>
            <Dropdown
              onOpenChange={setOpen}
              menu={{
                items: item.dropdownMenuItems.map((sub) => ({
                  key: sub.url,
                  label: (
                    <a
                      href={sub.url}
                      className="flex items-center gap-2 px-1 py-2 text-sm hover:bg-light-emphasis"
                    >
                      <Image
                        src={sub.icon ?? "/img/default.png"}
                        alt={sub.menu}
                        width={16}
                        height={16}
                      />
                      <span className="text-dark">{sub.menu}</span>
                    </a>
                  ),
                })),
              }}
            >
              <a href={item.url} className="flex items-center gap-2">
                {item.menu}
                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className="text-xs transition-transform duration-200"
                />
              </a>
            </Dropdown>
          </li>
        ) : (
          <MainMenuItem key={item.url} menu={item.menu} url={item.url} />
        )
      )}
    </ul>
  );
};

const AuthActionButtons = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row items-center gap-4">
      <button
        onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        className="bg-tertiary text-tx-primary-accent font-bold rounded-2xl px-6 py-2 hover:bg-tertiary-hover transition cursor-pointer"
      >
        Login
      </button>
      <button
        onClick={() => router.push(ROUTES.AUTH.REGISTER)}
        className="bg-primary text-white font-bold rounded-2xl px-6 py-2 hover:bg-primary-hover transition cursor-pointer"
      >
        Register
      </button>
      <ThemeSwitcher />
    </div>
  );
};

const UserDropdownMenu = ({
  name,
  username,
  role,
}: {
  name: string;
  username: string;
  role: Role;
}) => {
  const { logout } = useAuth();
  const router = useRouter();
  const userMenus = userDropdownMenuItems[role] || [];
  const [open, setOpen] = useState(false);
  const { data: userStats } = useUserStats();

  const handleNavigate = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();

    if (item.dynamicPath && username) {
      router.push(item.dynamicPath(username));
      return;
    }

    if (item.url) router.push(item.url);
  };

  const handleLogoutClick = () => {
    const asyncLogout = async () => {
      await logout();
    };
    asyncLogout();
  };

  return (
    <Dropdown
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      getPopupContainer={(trigger) => trigger.parentElement!}
      menu={{
        className: "min-w-[8rem] max-w-[10rem]",
        items: [
          // Normal menu items
          ...userMenus.map((item) => ({
            key: item.menu,
            label: (
              <a
                href={item.url ?? "#"}
                onClick={(e) => handleNavigate(e, item)}
                className="flex items-center gap-2 px-1 py-2 hover:bg-light-emphasis"
              >
                {item.icon && (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-4 h-4 text-tx-tertiary"
                  />
                )}
                <span className="text-sm text-tx-secondary">{item.menu}</span>
              </a>
            ),
          })),

          {
            key: "divider1",
            label: <div className="h-[1px] bg-light-emphasis my-1" />,
          },

          // Theme
          {
            key: "theme",
            label: (
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-sm text-tx-secondary">Theme</span>
                <ThemeSwitcher />
              </div>
            ),
          },

          {
            key: "divider2",
            label: <div className="h-[1px] bg-light-emphasis my-1" />,
          },

          // Logout
          {
            key: "logout",
            label: (
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 w-full text-left px-1 py-2 text-sm text-tx-secondary hover:bg-light-emphasis cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="w-4 h-4 text-tx-tertiary"
                />
                Log out
              </button>
            ),
          },
        ],
      }}
      placement="bottomRight"
      className="cursor-pointer"
    >
      <div className="flex items-center gap-3 text-dark cursor-pointer select-none">
        <Image src="/img/profile.png" alt="Profile" width={32} height={32} />
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium">Hello, {name}</p>

          {role === Role.STUDENT && (
            <div className="flex items-center gap-1">
              <span className="bg-tertiary text-[0.625rem] rounded-lg px-3">
                {userStats?.level ?? 0}
              </span>
              <p className="text-[0.625rem]">
                {userStats?.currXp ?? 0}/{userStats?.nextLvlMinXp ?? 0}
              </p>
            </div>
          )}
        </div>

        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="text-xs transition-transform duration-200"
        />
      </div>
    </Dropdown>
  );
};

const Header = () => {
  const { user, role, loading } = useGetCachedUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-surface px-6 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <h1
          className="text-tx-primary-accent text-2xl font-bold uppercase cursor-pointer"
          onClick={() => router.push("/")}
        >
          Gamification
        </h1>

        <div className="hidden lg:flex flex-1 items-center justify-between ms-8">
          <MainMenuItemWrapper role={role} />
          {loading ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          ) : user && role !== Role.GUEST ? (
            <UserDropdownMenu
              name={user.name}
              username={user.username}
              role={role}
            />
          ) : (
            <AuthActionButtons />
          )}
        </div>

        <button
          className="lg:hidden text-tx-primary-accent cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon
            icon={menuOpen ? faXmark : faBars}
            className="text-2xl"
          />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-6">
          <MainMenuItemWrapper role={role} isMobile />
          {loading ? (
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          ) : user && role !== Role.GUEST ? (
            <UserDropdownMenu
              name={user.name}
              username={user.username}
              role={role}
            />
          ) : (
            <AuthActionButtons />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
