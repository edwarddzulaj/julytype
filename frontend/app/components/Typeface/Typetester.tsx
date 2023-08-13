"use client";
import Fontsampler from "fontsampler-js/dist/fontsampler";
import FontsamplerSkin from "fontsampler-js/dist/fontsampler-skin";
import fontSamplerStyles from "fontsampler-js/dist/fontsampler-skin.css";
import { useEffect, useRef, useMemo } from "react";

export default function Typetester({
  typetesterText = "Type something...",
  fontName = "Font",
  fontPath = "",
}: {
  typetesterText: string | undefined;
  fontName: string | undefined;
  fontPath: string | URL;
}) {
  const demoRef = useRef(null);

  const fonts = useMemo(
    () => [
      {
        name: fontName,
        files: [fontPath],
      },
    ],
    [fontName, fontPath]
  );

  const options = useMemo(
    () => ({
      order: [
        ["opentype", "language", "alignment"],
        ["fontsize", "lineheight", "letterspacing"],
        "tester",
      ],
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
    <div id="demo" ref={demoRef} className={fontSamplerStyles}>
      {typetesterText}
    </div>
  );
}
