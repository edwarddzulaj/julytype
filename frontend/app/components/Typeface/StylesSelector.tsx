"use client";
import { Style } from "@/@types/contentTypes";
import { SelectedStyleIdContext } from "@/app/providers";
import { useContext, useState } from "react";

export default function StylesSelector({ styles }: { styles: Style[] }) {
  const context = useContext(SelectedStyleIdContext);
  const [selectedStyleId, setSelectedStyleId] = useState(styles[0].id);
  const selectStyle = (styleId: number) => {
    setSelectedStyleId(styleId);
    context.updateStyleId(styleId);
  };

  return (
    <div className="styles-selector">
      <h6>Choose Optical style</h6>
      <ul className="styles">
        {styles.map((style) => (
          <li
            key={style.id}
            className={`style ${style.id === selectedStyleId ? "active" : ""}`}
            onClick={() => selectStyle(style.id)}
          >
            {style.attributes.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
