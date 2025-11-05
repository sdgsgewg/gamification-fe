"use client";

import React, { useState } from "react";
import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  getMainMenuItems,
  MenuItem,
  userDropdownMenuItems,
} from "@/app/constants/menuItems";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { Role } from "@/app/enums/Role";
import { ROUTES } from "@/app/constants/routes";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";
import ThemeSwitcher from "../../shared/ThemeSwitcher";
import { useUserStats } from "@/app/hooks/users/useUserStats";

interface MainMenuItemProps {
  url: string;
  menu: string;
}

const MainMenuItem = ({ url, menu }: MainMenuItemProps) => (
  <li className="text-dark">
    <a href={url}>{menu}</a>
  </li>
);

interface MainMenuItemWrapperProps {
  role: Role;
  isMobile?: boolean;
}

const MainMenuItemWrapper = ({
  role,
  isMobile = false,
}: MainMenuItemWrapperProps) => {
  const [open, setOpen] = useState(false); // <-- state untuk buka/tutup dropdown

  const filteredItems = getMainMenuItems(role).filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul
      className={`flex ${isMobile ? "flex-col gap-4" : "items-center gap-6"}`}
    >
      {filteredItems.map((item) =>
        item.dropdownMenuItems ? (
          <li key={item.menu} className="text-dark">
            <Dropdown
              onOpenChange={(flag) => setOpen(flag)} // <-- handle buka/tutup
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
        Masuk
      </button>
      <button
        onClick={() => router.push(ROUTES.AUTH.REGISTER)}
        className="bg-primary text-white font-bold rounded-2xl px-6 py-2 hover:bg-primary-hover transition cursor-pointer"
      >
        Daftar
      </button>
      <ThemeSwitcher />
    </div>
  );
};

interface UserDropdownMenuProps {
  name: string;
  username: string;
  role: Role;
}

const UserDropdownMenu = ({ name, username, role }: UserDropdownMenuProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const userMenus = userDropdownMenuItems[role] || [];
  const [open, setOpen] = useState(false); // <-- state untuk buka/tutup dropdown

  const { data: userStats } = useUserStats();

  if (!userStats) return;

  const { level, currXp, nextLvlMinXp } = userStats;

  const handleLogout = () => {
    const asyncLogout = async () => {
      await logout();
    };

    asyncLogout();

    router.push("/");
  };

  const handleMenuClick = async (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();

    if (item.menu.toLowerCase() === "keluar") {
      return handleLogout();
    }

    if (item.dynamicPath && username) {
      const path = item.dynamicPath(username);
      router.push(path);
      return;
    }

    if (item.url) router.push(item.url);
  };

  return (
    <div className="bg-surface flex items-center gap-4 ms-0 lg:ms-auto">
      <Dropdown
        trigger={["click"]}
        open={open}
        onOpenChange={(flag) => setOpen(flag)} // <-- handle buka/tutup
        getPopupContainer={(trigger) => trigger.parentElement!}
        menu={{
          items: [
            ...userMenus.map((item) => ({
              key: item.menu,
              label: (
                <a
                  href={item.url || "#"}
                  onClick={(e) => handleMenuClick(e, item)}
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
              key: "custom-divider",
              label: <div className="h-[1px] bg-light-emphasis my-1" />,
            },
            {
              key: "theme-switcher",
              label: (
                <div className="flex items-center justify-between px-1 py-1">
                  <span className="text-sm text-tx-secondary">Tema</span>
                  <ThemeSwitcher />
                </div>
              ),
            },
          ],
        }}
        placement="bottomRight"
        className="cursor-pointer"
      >
        {/* Header user info */}
        <div className="flex items-center gap-3 text-dark cursor-pointer select-none">
          <Image src="/img/profile.png" alt="Profile" width={32} height={32} />
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">Hello, {name}</p>
            {role === Role.STUDENT && (
              <div className="flex items-center gap-1">
                <span className="bg-tertiary text-[0.625rem] rounded-lg px-3">
                  {level}
                </span>
                <p className="text-[0.625rem]">
                  {currXp}/{nextLvlMinXp}
                </p>
              </div>
            )}
          </div>

          {/* Ganti ikon tergantung state open */}
          <FontAwesomeIcon
            icon={open ? faChevronUp : faChevronDown}
            className="text-xs transition-transform duration-200"
          />
        </div>
      </Dropdown>
    </div>
  );
};

const Header = () => {
  const { user, role } = useGetCachedUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  return (
    <header className="bg-surface px-6 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <h1
          className="text-tx-primary-accent text-2xl font-bold uppercase cursor-pointer"
          onClick={handleNavigateToHomePage}
        >
          Gamification
        </h1>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-1 items-center justify-between ms-8">
          <MainMenuItemWrapper role={role} />
          {!user || role === Role.GUEST ? (
            <AuthActionButtons />
          ) : (
            <UserDropdownMenu
              name={user.name}
              username={user.username}
              role={role}
            />
          )}
        </div>

        {/* Hamburger Icon (Mobile only) */}
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

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-6">
          <MainMenuItemWrapper role={role} isMobile />
          {!user || role === Role.GUEST ? (
            <AuthActionButtons />
          ) : (
            <UserDropdownMenu
              name={user.name}
              username={user.username}
              role={role}
            />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
