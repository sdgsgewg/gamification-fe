"use client";

import React, { useState } from "react";
import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  mainMenuItems,
  MenuItem,
  userDropdownMenuItems,
} from "@/app/constants/menuItems";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "@/app/functions/AuthProvider";
import { Role } from "@/app/enums/Role";
import { ROUTES } from "@/app/constants/routes";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";

interface MainMenuItemProps {
  url: string;
  menu: string;
}

const MainMenuItem = ({ url, menu }: MainMenuItemProps) => (
  <li className="text-black">
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
  const filteredItems = mainMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul
      className={`flex ${isMobile ? "flex-col gap-4" : "items-center gap-6"}`}
    >
      {filteredItems.map((item) =>
        item.dropdownMenuItems ? (
          <li key={item.menu} className="text-black">
            <Dropdown
              menu={{
                items: item.dropdownMenuItems.map((sub) => ({
                  key: sub.url,
                  label: (
                    <a
                      href={sub.url}
                      className="flex items-center gap-2 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Image
                        src={sub.icon ?? "/img/default.png"}
                        alt={sub.menu}
                        width={16}
                        height={16}
                      />
                      <span>{sub.menu}</span>
                    </a>
                  ),
                })),
              }}
            >
              <a href={item.url} className="flex items-center gap-2">
                {item.menu}
                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
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
    <div className="flex flex-row gap-4">
      <button
        onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        className="bg-[#EAE9FF] text-[#556FD7] font-bold rounded-2xl px-6 py-2 hover:bg-[#d9d8f2] transition cursor-pointer"
      >
        Masuk
      </button>
      <button
        onClick={() => router.push(ROUTES.AUTH.REGISTER)}
        className="bg-[#556FD7] text-white font-bold rounded-2xl px-6 py-2 hover:bg-[#445cc0] transition cursor-pointer"
      >
        Daftar
      </button>
    </div>
  );
};

interface UserDropdownMenuProps {
  name: string;
  username: string;
  role: Role;
  level?: number;
  xp?: number;
}

const UserDropdownMenu = ({
  name,
  username,
  role,
  level,
  xp,
}: UserDropdownMenuProps) => {
  const router = useRouter();
  const userMenus = userDropdownMenuItems[role] || [];
  const [nextLevelXp] = useState<number>(100);

  const handleLogout = () => {
    const logout = async () => {
      await auth.logout();
    };

    logout();

    router.push("/");
  };

  const handleMenuClick = async (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();

    if (item.menu.toLowerCase() === "keluar") {
      return handleLogout();
    }

    // Handle dynamic path
    if (item.dynamicPath && username) {
      const path = item.dynamicPath(username);
      router.push(path);
      return;
    }

    // Default navigation
    if (item.url) router.push(item.url);
  };

  return (
    <div className="ms-0 lg:ms-auto flex items-center gap-4">
      <Dropdown
        trigger={["click"]}
        menu={{
          items: userMenus.map((item) => ({
            key: item.menu,
            label: (
              <a
                href={item.url || "#"}
                onClick={(e) => handleMenuClick(e, item)}
                className="flex items-center gap-2 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.icon && (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-4 h-4 text-gray-600"
                  />
                )}
                <span>{item.menu}</span>
              </a>
            ),
          })),
        }}
        placement="bottomRight"
        className="cursor-pointer"
      >
        {/* Header user info */}
        <div className="flex items-center gap-3 text-black cursor-pointer">
          <Image src="/img/profile.png" alt="Profile" width={32} height={32} />
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">Halo, {name}</p>
            {role === Role.STUDENT && (
              <div className="flex items-center gap-1">
                <span className="bg-[#EAE9FF] text-[0.625rem] rounded-lg px-3">
                  {level}
                </span>
                <p className="text-[0.625rem]">
                  {xp}/{nextLevelXp}
                </p>
              </div>
            )}
          </div>
          <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
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
    <header className="bg-white px-6 py-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <h1
          className="text-[#556FD7] text-2xl font-bold uppercase cursor-pointer"
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
              level={user.level}
              xp={user.xp}
            />
          )}
        </div>

        {/* Hamburger Icon (Mobile only) */}
        <button
          className="lg:hidden text-[#556FD7] cursor-pointer"
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
              level={user.level}
              xp={user.xp}
            />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
