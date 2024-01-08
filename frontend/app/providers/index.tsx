"use client";

import { createContext, useState } from "react";
import { ThemeProvider } from "next-themes";

export const ScriptChoiceContext = createContext({ script: "", updateScript: (s: string) => {} });
export const SelectedStyleIdContext = createContext({
  styleId: 0,
  updateStyleId: (id: number) => {},
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
  const [styleId, setStyleId] = useState(0);

  const updateStyleId = (id: number) => {
    setStyleId(id);
  };

  return (
    <SelectedStyleIdContext.Provider value={{ styleId, updateStyleId }}>
      {children}
    </SelectedStyleIdContext.Provider>
  );
}

export function ThemeChangeProvider({ children }: any) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
