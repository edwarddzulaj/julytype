"use client";

import { ScriptChoiceContext } from "@/app/providers";
import { useContext, useState } from "react";

export default function ChooseScript() {
  const [isLatin, setIsLatin] = useState(true);
  const context = useContext(ScriptChoiceContext);

  const handleChangeScript = (script: string) => {
    setIsLatin(script === "latin");
    context.updateScript(script);
  };
  return (
    <article className="choose-script">
      <div>Choose script</div>
      <div className="buttons">
        <button className={isLatin ? "active" : ""} onClick={() => handleChangeScript("latin")}>
          Latin
        </button>
        <button className={!isLatin ? "active" : ""} onClick={() => handleChangeScript("cyrillic")}>
          Cyrillic
        </button>
      </div>
    </article>
  );
}
