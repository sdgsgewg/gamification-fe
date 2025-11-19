"use client";

import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Role } from "@/app/enums/Role";
import { useAuth } from "@/app/hooks/auth/useAuth";
import { useUserStats } from "@/app/hooks/users/useUserStats";
import { userDropdownMenuItems } from "@/app/constants/menuItems";
import { MenuLink } from "./MenuLink";
import { MenuDivider } from "./MenuDivider";
import ThemeSwitcher from "../../shared/ThemeSwitcher";
import { MenuAction } from "./MenuAction";

export const UserDropdownMenu = ({
  name,
  username,
  role,
}: {
  name: string;
  username: string;
  role: Role;
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  const [open, setOpen] = useState(false);
  const { data: userStats } = useUserStats();

  const menus = userDropdownMenuItems[role] || [];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 0);
  };

  return (
    <Dropdown
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
      menu={{
        className: "min-w-[8rem] max-w-[11rem]",
        items: [
          ...menus.map((item) => ({
            key: item.menu,
            label: <MenuLink item={item} username={username} />,
          })),

          { key: "divider1", label: <MenuDivider /> },
          {
            key: "theme",
            label: (
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-sm text-tx-secondary">Theme</span>
                <ThemeSwitcher />
              </div>
            ),
          },

          { key: "divider2", label: <MenuDivider /> },

          {
            key: "logout",
            label: (
              <MenuAction
                label="Log Out"
                icon={faRightFromBracket}
                onClick={handleLogout}
                isDanger
              />
            ),
          },
        ],
      }}
      placement="bottomRight"
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
