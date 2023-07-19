"use client";
import Fontsampler from "fontsampler-js/dist/fontsampler";
import FontsamplerSkin from "fontsampler-js/dist/fontsampler-skin";
import fontSamplerStyles from "fontsampler-js/dist/fontsampler-skin.css";
import { useEffect, useRef } from "react";
import localFont from "next/font/local";

const font = localFont({ src: "../../assets/fonts/PicNic/PicNic-Regular.woff" });

export default function Typetester({ typetesterText = "Type something..." }) {
  const demoRef = useRef(null);

  const fonts = [
    {
      name: "PicNic",
      files: ["http://localhost:3000/_next/static/media/e0bf6e69b5a56589-s.p.woff2"],
    },
    {
      name: "PicNic2",
      files: ["http://localhost:3000/_next/static/media/a38e548559ef61c4-s.p.woff"],
    },
  ];

  const options = {
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
  };

  useEffect(() => {
    if (demoRef) {
      const demo = new Fontsampler(demoRef.current, fonts, options);
      FontsamplerSkin(demo);
      demo.init();
    }
  }, []);

  return (
    <div id="demo" ref={demoRef} className={fontSamplerStyles + font.className}>
      {typetesterText}
    </div>
  );
}
