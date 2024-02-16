"use client";
import { Style } from "@/@types/contentTypes";
import { SelectedStyleContext } from "@/app/providers";
import { useContext, useState } from "react";

export default function StylesSelector({ styles }: { styles: Style[] }) {
  const context = useContext(SelectedStyleContext);
  const defaultStyleId = styles.findLast((s) => s.attributes.isDefaultStyle)?.id || styles[0].id;
  const [selectedStyleId, setSelectedStyleId] = useState(defaultStyleId);
  const selectStyle = (id: number, title: string) => {
    setSelectedStyleId(id);
    context.updateStyle(id, title);
  };

  return (
    <div className="styles-selector">
      <h6>Choose Optical style</h6>
      <ul className="styles">
        {styles.map((style) => (
          <li
            key={style.id}
            className={`style ${style.id === selectedStyleId ? "active" : ""}`}
            onClick={() => selectStyle(style.id, style.attributes.title)}
          >
            {style.attributes.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
