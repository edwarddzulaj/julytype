"use client";
import { useEffect } from "react";
import { TypefaceWeight } from "@/@types/components";
import { getStrapiMedia } from "@/app/utils/api-helpers";

export default function TypefaceSample({
  title,
  regularWeight,
  hoverWeight,
}: {
  title: String;
  regularWeight: TypefaceWeight | null;
  hoverWeight?: TypefaceWeight | null;
}) {
  const regularURL = getStrapiMedia(regularWeight!.fontFile?.data?.attributes?.url) || null;
  const hoveredURL = hoverWeight
    ? getStrapiMedia(hoverWeight!.fontFile?.data?.attributes?.url)
    : null;

  const fontSettings = {
    fontFamily: `${title} ${regularWeight!.title}, "Adobe Blank"`,
  };

  useEffect(() => {
    const newFont = new FontFace(`${title} ${regularWeight!.title}`, `url(${regularURL})`);
    const hoveredFont = new FontFace(`Hovered`, `url(${hoveredURL})`);

    newFont
      .load()
      .then(function (loaded_face) {
        document.fonts.add(loaded_face);
      })
      .catch(function (error) {
        console.error(error);
      });

    if (hoverWeight) {
      hoveredFont
        .load()
        .then(function (loaded_face) {
          document.fonts.add(loaded_face);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [title, regularURL, hoveredURL, regularWeight, hoverWeight]);

  return <h2 style={fontSettings}>{title}</h2>;
}
