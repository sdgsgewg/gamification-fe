"use client";

import React from "react";
import {
  sidebarAdminMenuItems,
  getSidebarMainMenuItems,
} from "@/app/constants/menuItems";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { Role } from "@/app/enums/Role";
import ThemeSwitcher from "../../shared/ThemeSwitcher";
import { useGetCachedUser } from "@/app/hooks/useGetCachedUser";

interface MainMenuItemProps {
  menu: string;
  icon: IconDefinition;
  url: string;
  role: string;
  onClick?: () => void;
  onCloseSidebar?: () => void;
}

const MainMenuItem = ({
  menu,
  icon,
  url,
  role,
  onClick,
  onCloseSidebar,
}: MainMenuItemProps) => {
  const modifiedRole = role.toLowerCase();
  const pathname = usePathname();

  const isActive =
    url == `/dashboard/${modifiedRole}`
      ? pathname === url
      : pathname === url || pathname.startsWith(url + "/");

  const handleClick = () => {
    if (onClick) onClick();
    if (onCloseSidebar) onCloseSidebar();
  };

  const baseClasses =
    "flex items-center gap-2 px-4 py-3 w-full text-left text-dark cursor-pointer transition duration-300 ease-in-out";
  const activeClasses = "!bg-secondary font-semibold";
  const hoverClasses = "hover:bg-tertiary-hover hover:font-medium";

  const classes = `${baseClasses} ${isActive ? activeClasses : hoverClasses}`;

  return (
    <li>
      <Link href={url} onClick={handleClick} className={classes}>
        <FontAwesomeIcon icon={icon} className="text-base" />
        <span className="text-sm">{menu}</span>
      </Link>
    </li>
  );
};

interface MainMenuItemWrapperProps {
  role: Role;
  onClose: () => void;
}

const MainMenuItemWrapper = ({ role, onClose }: MainMenuItemWrapperProps) => {
  const filteredItems = getSidebarMainMenuItems(role).filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul className={`flex flex-col gap-2`}>
      {filteredItems.map((item) => (
        <MainMenuItem
          key={item.url}
          menu={item.menu}
          icon={item.icon ?? faQuestionCircle}
          url={item.url}
          role={role}
          onCloseSidebar={onClose}
        />
      ))}
    </ul>
  );
};

interface AdminMenuItemWrapperProps {
  role: Role;
  onClose: () => void;
}

const AdminMenuItemWrapper = ({ role, onClose }: AdminMenuItemWrapperProps) => {
  const filteredItems = sidebarAdminMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div>
      <p className="text-xs font-semibold px-4 mb-1">Administrator</p>
      <ul className={`flex flex-col gap-2`}>
        {filteredItems.map((item) => (
          <MainMenuItem
            key={item.url}
            menu={item.menu}
            icon={item.icon ?? faQuestionCircle}
            url={item.url}
            role={role}
            onCloseSidebar={onClose}
          />
        ))}
      </ul>
    </div>
  );
};

const PersonalizationMenuItemWrapper = () => {
  return (
    <ul className="pt-4 border-t-2 border-br-primary">
      <p className="text-xs font-semibold px-4 mb-1">Personalization</p>
      <div className="flex items-center justify-between gap-2 px-4 py-3 w-full text-left text-dark">
        <span className="text-sm text-tx-secondary">Theme</span>
        <ThemeSwitcher />
      </div>
    </ul>
  );
};

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const { role } = useGetCachedUser();

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  const handleLogout = () => {
    const asyncLogout = async () => {
      await logout();
    };

    asyncLogout();
  };

  return (
    <aside className="bg-tertiary min-h-screen border-r-2 border-br-primary text-dark z-50">
      <div className="h-16 flex items-center justify-between ps-4 pe-2">
        <h1
          className="text-2xl font-bold uppercase cursor-pointer"
          onClick={handleNavigateToHomePage}
        >
          Gamification
        </h1>
        <button
          onClick={onClose}
          className="block lg:hidden text-tx-primary  cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>
      </div>
      <nav className="flex flex-col gap-4">
        <MainMenuItemWrapper role={role} onClose={onClose} />
        {role === Role.ADMIN && (
          <AdminMenuItemWrapper role={role} onClose={onClose} />
        )}
        <PersonalizationMenuItemWrapper />
        <ul className="pt-4 border-t-2 border-br-primary">
          <MainMenuItem
            menu="Logout"
            icon={faRightFromBracket}
            url="/"
            role={role}
            onClick={handleLogout}
            onCloseSidebar={onClose}
          />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
