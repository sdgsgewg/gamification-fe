"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faAdjust } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="middle" className="rounded-full">
        <FontAwesomeIcon
          icon={faAdjust}
          className="absolute h-10 w-10 scale-100"
        />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="middle"
      className="rounded-full cursor-pointer"
      onClick={switchTheme}
    >
      <FontAwesomeIcon
        icon={faSun}
        className={`absolute h-10 w-10 rotate-90 scale-0 ${
          theme === "dark" ? "rotate-0 scale-100" : ""
        } transition-all duration-500`}
      />
      <FontAwesomeIcon
        icon={faMoon}
        className={`absolute h-10 w-10 rotate-0 scale-100 ${
          theme === "dark" ? "dark:-rotate-90 dark:scale-0" : ""
        } transition-all duration-500`}
      />
    </Button>
  );
};

export default ThemeSwitcher;
