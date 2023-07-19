"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [switchToggle, setSwitchToggle] = useState("X");
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
      setSwitchToggle("O");
    } else {
      setTheme("dark");
      setSwitchToggle("X");
    }
  };

  return <div onClick={() => toggleTheme()}>{switchToggle}</div>;
}
