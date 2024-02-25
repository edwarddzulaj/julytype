"use client";
import { Style } from "@/@types/contentTypes";
import { SelectedStyleContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";

export default function StylesSelector({ styles }: { styles: Style[] }) {
  const context = useContext(SelectedStyleContext);
  const defaultStyle = styles.findLast((s) => s.attributes.isDefaultStyle) || styles[0];
  const [selectedStyleId, setSelectedStyleId] = useState(defaultStyle.id);

  const selectStyle = (id: number, title: string) => {
    setSelectedStyleId(id);
    context.updateStyle(id, title);
  };

  useEffect(() => {
    context.updateStyle(defaultStyle.id, defaultStyle.attributes.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
