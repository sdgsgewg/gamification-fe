"use client";

import React, { useEffect, useState } from "react";
import {
  sidebarAdminMenuItems,
  sidebarMainMenuItems,
} from "@/app/constants/menuItems";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { auth } from "@/app/functions/AuthProvider";
import { Role } from "@/app/enums/Role";

interface MainMenuItemProps {
  menu: string;
  icon: IconDefinition;
  url: string;
  onClick?: () => void;
  onCloseSidebar?: () => void;
}

const MainMenuItem = ({
  menu,
  icon,
  url,
  onClick,
  onCloseSidebar,
}: MainMenuItemProps) => {
  const pathname = usePathname();

  const isActive =
    url === "/dashboard"
      ? pathname === url
      : pathname === url || pathname.startsWith(url + "/");

  const handleClick = () => {
    if (onClick) onClick();
    if (onCloseSidebar) onCloseSidebar();
  };

  const baseClasses =
    "bg-[#E9E8FF] flex items-center gap-2 px-4 py-3 w-full text-left text-black cursor-pointer transition duration-300 ease-in-out";
  const activeClasses = "!bg-[#D3D0FF] font-semibold";
  const hoverClasses = "hover:bg-[#DCD9FF] hover:font-medium";

  const classes = `${baseClasses} ${isActive ? activeClasses : hoverClasses}`;

  return (
    <li>
      {onClick ? (
        <button onClick={handleClick} className={classes}>
          <FontAwesomeIcon icon={icon} className="text-base" />
          <span className="text-sm">{menu}</span>
        </button>
      ) : (
        <Link href={url} onClick={handleClick} className={classes}>
          <FontAwesomeIcon icon={icon} className="text-base" />
          <span className="text-sm">{menu}</span>
        </Link>
      )}
    </li>
  );
};

interface MainMenuItemWrapperProps {
  role: Role;
  onClose: () => void;
}

const MainMenuItemWrapper = ({ role, onClose }: MainMenuItemWrapperProps) => {
  const filteredItems = sidebarMainMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul className={`flex flex-col gap-2`}>
      {filteredItems.map((item) => (
        <MainMenuItem
          key={item.url}
          menu={item.menu}
          url={item.url}
          icon={item.icon ?? faQuestionCircle}
          onCloseSidebar={onClose} // ✅ Tutup sidebar setelah klik menu
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
            url={item.url}
            icon={item.icon ?? faQuestionCircle}
            onCloseSidebar={onClose} // ✅ Tutup sidebar juga
          />
        ))}
      </ul>
    </div>
  );
};

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();

  const [userRole, setUserRole] = useState<Role>(Role.ADMIN);

  const handleNavigateToHomePage = () => {
    router.push("/");
  };

  const handleLogout = () => {
    const logout = async () => {
      await auth.logout();
    };

    logout();

    router.push("/");
  };

  useEffect(() => {
    const user = auth.getCachedUserProfile();
    if (user) setUserRole(user.role.name);
  }, []);

  return (
    <aside className="bg-[#EAE9FF] min-h-screen border-r-2 border-[#BCB4FF] text-black">
      <div className="h-16 flex items-center justify-between ps-4 pe-2">
        <h1
          className="text-2xl font-bold uppercase cursor-pointer"
          onClick={handleNavigateToHomePage}
        >
          Gamification
        </h1>
        <button
          onClick={onClose}
          className="block lg:hidden text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>
      </div>
      <nav className="flex flex-col gap-4">
        <MainMenuItemWrapper role={userRole} onClose={onClose} />
        {userRole === Role.ADMIN && (
          <AdminMenuItemWrapper role={userRole} onClose={onClose} />
        )}
        <ul className="pt-4 border-t-2 border-[#BCB4FF]">
          <MainMenuItem
            menu="Keluar"
            icon={faRightFromBracket}
            url="#"
            onClick={handleLogout}
            onCloseSidebar={onClose}
          />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
