"use client";

import React, { useState } from "react";
import {
  Role,
  sidebarAdminMenuItems,
  sidebarMainMenuItems,
} from "@/app/constants/menuItems";
import { usePathname, useRouter } from "next/navigation";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

interface MainMenuItemProps {
  menu: string;
  icon: IconDefinition;
  url: string;
}

const MainMenuItem = ({ menu, icon, url }: MainMenuItemProps) => {
  const pathname = usePathname();

  // Untuk URL '/dashboard', hanya aktif jika pathname tepat '/dashboard'
  // Untuk URL lainnya, aktif jika pathname dimulai dengan URL + '/'
  const isActive =
    url === "/dashboard"
      ? pathname === url
      : pathname === url || pathname.startsWith(url + "/");

  return (
    <li>
      <Link
        href={url}
        className={`flex items-center gap-2 px-4 py-3 transition ${
          isActive ? "bg-[#D3D0FF] font-semibold" : ""
        } text-black`}
      >
        <FontAwesomeIcon icon={icon} className="text-base" />
        <span className="text-sm">{menu}</span>
      </Link>
    </li>
  );
};

interface MainMenuItemWrapperProps {
  role: Role;
}

const MainMenuItemWrapper = ({ role }: MainMenuItemWrapperProps) => {
  const filteredItems = sidebarMainMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <ul className={`flex flex-col gap-2`}>
      {filteredItems.map((item) => (
        <li key={item.menu} className="text-black">
          <MainMenuItem
            key={item.url}
            menu={item.menu}
            url={item.url}
            icon={item.icon ?? faQuestionCircle}
          />
        </li>
      ))}
    </ul>
  );
};

interface AdminMenuItemWrapperProps {
  role: Role;
}

const AdminMenuItemWrapper = ({ role }: AdminMenuItemWrapperProps) => {
  const filteredItems = sidebarAdminMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div>
      <p className="text-xs font-semibold px-4 mb-1">Administrator</p>
      <ul className={`flex flex-col gap-2`}>
        {filteredItems.map((item) => (
          <li key={item.menu} className="text-black">
            <MainMenuItem
              key={item.url}
              menu={item.menu}
              url={item.url}
              icon={item.icon ?? faQuestionCircle}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const Sidebar = () => {
  const router = useRouter();

  const [userRole, setUserRole] = useState<Role>("admin");

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <aside className="w-64 bg-[#EAE9FF] min-h-screen border-r-2 border-[#BCB4FF] text-black">
      <div className="h-16 flex items-center">
        <h1 className="text-2xl font-bold uppercase px-4">Gamification</h1>
      </div>
      <nav className="flex flex-col gap-4">
        <MainMenuItemWrapper role={userRole} />
        {userRole === "admin" && <AdminMenuItemWrapper role={userRole} />}
        <ul className="pt-4 border-t-2 border-[#BCB4FF]">
          <li className="text-black" onClick={handleLogout}>
            <MainMenuItem menu="Keluar" icon={faRightFromBracket} url="#" />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
