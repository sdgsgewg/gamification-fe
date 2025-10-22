"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import {
  footerHelpMenuItems,
  footerMainMenuItems,
} from "@/app/constants/menuItems";
import { Role } from "@/app/enums/Role";
import { auth } from "@/app/functions/AuthProvider";

const AboutSection = () => {
  return (
    <div className="max-w-60 flex flex-col gap-2">
      <h1 className="text-white text-2xl font-bold uppercase">Gamification</h1>
      <p className="text-white text-sm">
        Platform belajar interaktif berbasis game untuk siswa dan guru.
      </p>
    </div>
  );
};

interface MenuItemProps {
  url: string;
  menu: string;
}

const MenuItem = ({ url, menu }: MenuItemProps) => (
  <li className="text-white text-sm font-normal">
    <a href={url}>{menu}</a>
  </li>
);

interface MenuItemWrapperProps {
  role: Role;
}

const MainMenuItemWrapper = ({ role }: MenuItemWrapperProps) => {
  const filteredItems = footerMainMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div>
      <h2 className="text-white text-lg font-semibold mb-3">Navigasi</h2>
      <ul className="flex flex-col gap-2">
        {filteredItems.map((item) => (
          <MenuItem key={item.url} menu={item.menu} url={item.url} />
        ))}
      </ul>
    </div>
  );
};

const HelpMenuItemWrapper = ({ role }: MenuItemWrapperProps) => {
  const filteredItems = footerHelpMenuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-white text-lg font-semibold">Bantuan</h2>
      <ul className="flex flex-col gap-2">
        {filteredItems.map((item) => (
          <MenuItem key={item.url} menu={item.menu} url={item.url} />
        ))}
      </ul>
    </div>
  );
};

interface SocialMediaIconProps {
  url: string;
  icon: IconDefinition;
}

const SocialMediaIcon = ({ url, icon }: SocialMediaIconProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
    </a>
  );
};

const FollowUsSection = () => {
  return (
    <div className="flex flex-col gap-3 ml-0 xl:ml-48">
      <h2 className="text-white text-lg font-semibold">Ikuti Kami</h2>
      <div className="flex gap-3">
        <SocialMediaIcon url="#" icon={faInstagram} />
        <SocialMediaIcon url="#" icon={faYoutube} />
        <SocialMediaIcon url="#" icon={faTiktok} />
      </div>
    </div>
  );
};

const CopyrightSection = () => {
  return (
    <div className="flex items-center justify-center pt-8 border-t-2 border-br-tertiary mt-6">
      <p className="text-white text-sm font-normal text-center">
        &copy; Copyright {new Date().getFullYear()}. All rights reserved.
      </p>
    </div>
  );
};

const Footer = () => {
  const user = auth.getCachedUserProfile();
  const userRole = user?.role.name ?? Role.GUEST;

  return (
    <footer className="bg-primary px-6 py-8 mt-auto">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-24 xl:gap-32 mb-8">
        <AboutSection />
        <MainMenuItemWrapper role={userRole} />
        <HelpMenuItemWrapper role={userRole} />
        <FollowUsSection />
      </div>
      <CopyrightSection />
    </footer>
  );
};

export default Footer;
