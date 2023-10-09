"use client";

import { createContext, useState } from "react";
import { ThemeProvider } from "next-themes";

export const ScriptChoiceContext = createContext({ script: "", updateScript: (s: string) => {} });

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

export function ThemeChangeProvider({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
