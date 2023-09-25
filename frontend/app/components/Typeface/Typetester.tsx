"use client";
import Fontsampler from "fontsampler-js/dist/fontsampler";
import FontsamplerSkin from "fontsampler-js/dist/fontsampler-skin";
import fontSamplerStyles from "fontsampler-js/dist/fontsampler-skin.css";
import { useEffect, useRef, useMemo, useState } from "react";

export default function Typetester({
  typetesterText = "Type something...",
  fontsData = [
    {
      name: "Font",
      fontPath: "",
    },
  ],
}: {
  typetesterText?: string | undefined;
  fontsData: {
    name: string | undefined;
    fontPath: string | URL;
  }[];
}) {
  const [isTextEditable, setIsTextEditable] = useState(false);
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
      initialText: typetesterText,
      order: [["fontfamily", "language", "fontsize", "opentype", "alignment"], "tester"],
      config: {
        fontfamily: {
          label: false,
        },
        language: {
          choices: ["enGB|English", "deDe|Deutsch", "nlNL|Dutch"],
          init: "enGb",
          label: false,
        },
        fontsize: {
          unit: "px",
          init: 64,
          min: 12,
          max: 192,
          step: 1,
          label: "Size",
        },
        opentype: {
          choices: [
            "liga|Ligatures",
            "frac|Fractions",
            "c2sc|Small capitals from capitals",
            "smcp|Small caps",
            "subs|Subscript",
            "sups|Superscript",
            "onum|Old style figures",
            "lnum|Lining figures",
            "tnum|Tabular figures",
            "locl|Localized forms",
            "ss01|Stylistic set 1",
            "ss02|Stylistic set 2",
          ],
          init: ["liga", "frac"],
          label: false,
        },
        alignment: {
          choices: ["left|Left", "center|Centered", "right|Right"],
          init: "left",
          label: false,
        },
        tester: {
          editable: true,
          label: false,
        },
      },
      lazyload: true,
    }),
    [typetesterText]
  );

  useEffect(() => {
    if (demoRef) {
      const demo = new Fontsampler(demoRef.current, fonts, options);
      FontsamplerSkin(demo);
      demo.init();
    }
  }, [fonts, isTextEditable, options]);

  const handleEditableClick = () => {
    setIsTextEditable(!isTextEditable);
  };

  return (
    <>
      {/* <button onClick={() => handleEditableClick()}>Edit text</button> */}
      <div id={typetesterId} ref={demoRef} className={fontSamplerStyles.toString()}>
        {typetesterText}
      </div>
    </>
  );
}
