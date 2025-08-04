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
  userDropdownMenuItems,
  Role,
} from "@/app/constants/menuItems";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        onClick={() => router.push("/login")}
        className="bg-[#EAE9FF] text-[#556FD7] font-bold rounded-2xl px-6 py-2 hover:bg-[#d9d8f2] transition"
      >
        Masuk
      </button>
      <button
        onClick={() => router.push("/register")}
        className="bg-[#556FD7] text-white font-bold rounded-2xl px-6 py-2 hover:bg-[#445cc0] transition"
      >
        Daftar
      </button>
    </div>
  );
};

const UserDropdownMenu = ({ role }: { role: Role }) => {
  const userMenus = userDropdownMenuItems[role] || [];

  return (
    <div className="ms-auto flex items-center gap-4">
      <Dropdown
        trigger={["click"]}
        menu={{
          items: userMenus.map((item) => ({
            key: item.url,
            label: (
              <a
                href={item.url}
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
        <div className="flex items-center gap-3 text-black">
          <Image
            src={"/img/profile.png"}
            alt={"Profile"}
            width={32}
            height={32}
          />
          <div className="flex flex-col gap-1">
            <p className="text-base font-medium">
              Halo, {role.charAt(0).toUpperCase() + role.slice(1)}
            </p>
            {role === "student" && (
              <div className="flex items-center gap-1">
                <span className="bg-[#EAE9FF] text-[0.625rem] rounded-lg px-3">
                  25
                </span>
                <p className="text-[0.625rem]">20000/33800XP</p>
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
  const [userRole, setUserRole] = useState<Role>("guest");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white px-6 py-4 shadow-md relative">
      <div className="flex items-center justify-between">
        <h1 className="text-[#556FD7] text-2xl font-bold uppercase">
          Gamification
        </h1>

        {/* Desktop menu */}
        <div className="hidden lg:flex flex-1 items-center justify-between ms-8">
          <MainMenuItemWrapper role={userRole} />
          {userRole === "guest" ? (
            <AuthActionButtons />
          ) : (
            <UserDropdownMenu role={userRole} />
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
          <MainMenuItemWrapper role={userRole} isMobile />
          {userRole === "guest" ? (
            <AuthActionButtons />
          ) : (
            <UserDropdownMenu role={userRole} />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
