"use client";
import Fontsampler from "fontsampler-js/dist/fontsampler";
import FontsamplerSkin from "fontsampler-js/dist/fontsampler-skin";
import fontSamplerStyles from "fontsampler-js/dist/fontsampler-skin.css";
import { useEffect, useRef, useMemo } from "react";

export default function Typetester({
  typetesterText = "Type something...",
  fontsData = [
    {
      name: "Font",
      fontPath: "",
    },
  ],
}: {
  typetesterText: string | undefined;
  fontsData: {
    name: string | undefined;
    fontPath: string | URL;
  }[];
}) {
  const demoRef = useRef(null);

  const fonts = useMemo(
    () =>
      fontsData.map((font) => {
        return {
          name: font.name,
          files: [font.fontPath],
        };
      }),
    [fontsData]
  );

  const typetesterId = fontsData[0]?.name?.toLowerCase().replace(/\s/g, "");

  const options = useMemo(
    () => ({
      order: [["fontfamily", "language", "fontsize", "alignment", "opentype"], "tester"],
      ui: {
        language: {
          choices: ["enGB|English", "deDe|Deutsch", "nlNL|Dutch"],
          init: "enGb",
          label: "Language",
        },

        opentype: {
          choices: ["liga|Ligatures", "frac|Fractions"],
          init: ["liga"],
          label: "Opentype features",
        },
      },
      lazyload: true,
    }),
    []
  );

  useEffect(() => {
    if (demoRef) {
      const demo = new Fontsampler(demoRef.current, fonts, options);
      FontsamplerSkin(demo);
      demo.init();
    }
  }, [fonts, options]);

  return (
    <div id={typetesterId} ref={demoRef} className={fontSamplerStyles.toString()}>
      {typetesterText}
    </div>
  );
}
