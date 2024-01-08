"use client";
import { useContext } from "react";

import { getStrapiMedia } from "@/app/utils/api-helpers";
import { FontsData } from "./Typetester/typetester-types";
import { Style } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";

import { SelectedStyleIdContext } from "@/app/providers";
import Typetester from "./Typetester/Typetester";

export default function StyleWeights({ styles }: { styles: Style[] }) {
  const { styleId } = useContext(SelectedStyleIdContext);

  const style = styles.find((s) => s.id == styleId) || styles[0];
  const { title, weights, lineHeight } = style?.attributes ?? { title: "", weights: [] };
  return (
    <section className="typetesters">
      {weights.map((weight: TypefaceWeight) => {
        const fontLabel = `${title.trim()} ${weight.title.trim()}`;
        const typetesterData: FontsData = {
          label: fontLabel,
          value: btoa(weight.title),
          fontPath: getStrapiMedia(weight.fontFile?.data?.attributes?.url),
        };

        return (
          <Typetester
            key={weight.id}
            fontsData={[typetesterData]}
            typetesterLanguageGroup={weight.typetesterLanguageGroup}
            defaultOptions={{ lineHeight: lineHeight }}
          />
        );
      })}
    </section>
  );
}
