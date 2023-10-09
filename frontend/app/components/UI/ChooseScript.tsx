"use client";

import { ScriptChoiceContext } from "@/app/providers";
import { useContext } from "react";

export default function ChooseScript() {
  const context = useContext(ScriptChoiceContext);

  const handleChangeScript = (script: string) => {
    context.updateScript(script);
  };
  return (
    <>
      <div>Choose script</div>
      <div>
        <button className="active" onClick={() => handleChangeScript("latin")}>
          Latin
        </button>
        <button onClick={() => handleChangeScript("cyrillic")}>Cyrillic</button>
      </div>
    </>
  );
}
