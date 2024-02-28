"use client";
import Link from "next/link";

import { TypefaceWeight } from "@/@types/components";
import { Style } from "@/@types/contentTypes";
import { SelectedStyleContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";

export default function ChooseWeight({ styles }: { styles: Style[] }) {
  const [styleTitle, setStyleTitle] = useState("");
  const [fontWeights, setFontWeights] = useState<TypefaceWeight[] | []>();
  const { style: chosenStyle } = useContext(SelectedStyleContext);

  useEffect(() => {
    const style = styles.find((s) => s.id == chosenStyle.id) || styles[0];
    setStyleTitle(style.attributes.title);

    const { weights } = style?.attributes ?? { title: "", weights: [] };
    setFontWeights(weights);
  }, [chosenStyle, styles]);

  return (
    <article className="choose-weight">
      {fontWeights && fontWeights.length > 1 && (
        <>
          <h6>Jump to</h6>
          <ul>
            {fontWeights.map((weight) => {
              const fontTitle = `${styleTitle.trim()} ${weight?.title.trim()}`;
              return (
                <li key={weight.id} style={{ fontFamily: fontTitle }}>
                  <Link href={`#${btoa(weight.title)}`}>{weight.title}</Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </article>
  );
}
