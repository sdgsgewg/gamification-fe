"use client";

import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Button from "./components/shared/Button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="middle"
      className="!rounded-full"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <FontAwesomeIcon
        icon={faSun}
        className="absolute h-10 w-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all duration-500"
      />
      <FontAwesomeIcon
        icon={faMoon}
        className="absolute h-10 w-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all duration-500"
      />
    </Button>
  );
}
