"use client";
import { useEffect, useMemo, useState } from "react";
import { TypefaceWeight } from "@/@types/components";
import { getStrapiMedia } from "@/app/utils/api-helpers";

export default function TypefaceSample({
  title,
  regularWeight,
  hoverWeight,
}: {
  title: string;
  regularWeight: TypefaceWeight | null;
  hoverWeight?: TypefaceWeight | null;
}) {
  const [isHover, setIsHover] = useState(false);

  const regularURL = getStrapiMedia(regularWeight!.fontFile?.data?.attributes?.url) || null;
  const hoveredURL = hoverWeight
    ? getStrapiMedia(hoverWeight!.fontFile?.data?.attributes?.url)
    : null;

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const fontSettings = useMemo(() => {
    return {
      fontFamily:
        isHover && hoverWeight
          ? `${title} ${hoverWeight!.title}`
          : `${title} ${regularWeight!.title}, "Adobe Blank"`,
    };
  }, [hoverWeight, isHover, regularWeight, title]);

  useEffect(() => {
    const regularWeightFont = `${title} ${regularWeight!.title}`;
    const hoverWeightFont = `${title} ${hoverWeight?.title}`;

    document.fonts.ready.then((fontFaceSet) => {
      const loadedFaces = [...fontFaceSet];

      const isRegularFontLoaded = loadedFaces.find((f) => f.family === regularWeightFont);
      const isHoverFontLoaded = loadedFaces.find((f) => f.family === hoverWeightFont);

      if (!isRegularFontLoaded) {
        const newFont = new FontFace(regularWeightFont, `url(${regularURL})`);
        newFont
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace);
          })
          .catch(function (error) {
            console.error(error);
          });
      }

      if (hoverWeight && !isHoverFontLoaded) {
        const hoveredFont = new FontFace(hoverWeightFont, `url(${hoveredURL})`);

        hoveredFont
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace);
          })
          .catch(function (error) {
            console.error(error);
          });
      }
    });
  }, [title, regularURL, hoveredURL, regularWeight, hoverWeight]);

  return (
    <h2 onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={fontSettings}>
      {title}
    </h2>
  );
}
