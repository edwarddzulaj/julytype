"use client";

import { createContext, useState } from "react";
import { ThemeProvider } from "next-themes";

export const ScriptChoiceContext = createContext({ script: "", updateScript: (s: string) => {} });
export const SelectedStyleContext = createContext({
  style: { id: 0, title: "Typeface style" },
  updateStyle: (id: number, title: string) => {},
});

export function ScriptChoiceProvider({ children }: any) {
  const [script, setScript] = useState("latin");

  const updateScript = (script: string) => {
    setScript(script);
  };

  return (
    <ScriptChoiceContext.Provider value={{ script, updateScript }}>
      {children}
    </ScriptChoiceContext.Provider>
  );
}

export function SelectedStyleProvider({ children }: any) {
  const [style, setStyle] = useState({ id: 0, title: "Typeface style" });

  const updateStyle = (id: number, title: string) => {
    setStyle({ id, title });
  };

  return (
    <SelectedStyleContext.Provider value={{ style, updateStyle }}>
      {children}
    </SelectedStyleContext.Provider>
  );
}

export function ThemeChangeProvider({ children }: any) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
