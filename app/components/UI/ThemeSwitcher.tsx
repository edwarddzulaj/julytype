"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Iconly, { icons } from "./Iconly";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div onClick={() => toggleTheme()}>
      <Iconly icon={icons.contrast} />
    </div>
  );
}
