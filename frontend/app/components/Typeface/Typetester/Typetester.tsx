"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Dropdown from "react-dropdown";
import CheckboxDropdown from "../../UI/CheckboxDropdown";
import { FontsData } from "./typetester-types";
import { TypetesterTextGroup } from "@/@types/components";

import { indexAllSamples, getRandomIndex } from "@/app/typefaces/[slug]/helpers";
import {
  staticOptions,
  languages,
  opentypeFeatures,
  alignmentOptions,
  columnOptions,
} from "./typetester-config";

import Iconly, { icons } from "../../UI/Iconly";
import { ScriptChoiceContext } from "@/app/providers";

export default function Typetester({
  fontsData = [
    {
      label: "Font",
      value: "font",
      fontPath: "",
    },
  ],
  typetesterLanguageGroup,
}: {
  fontsData: FontsData[];
  typetesterLanguageGroup?: TypetesterTextGroup[] | undefined;
}) {
  const fontTesterRef = useRef<HTMLInputElement>(null);
  const [fontFamily, setFontFamily] = useState(fontsData[0]);
  const [sampleLang, setSampleLang] = useState(languages[0].value);
  const [fontSize, setFontSize] = useState(72);
  const [features, setFeatures] = useState(opentypeFeatures);
  const [alignment, setAlignment] = useState(alignmentOptions.find((f) => f.checked)?.value);
  const [textColumns, setTextColumns] = useState(1);
  const [isTextEditable, setIsTextEditable] = useState("false");
  const [typetester, setTypetester] = useState({ text: "", index: null });
  const [isLatin, setIsLatin] = useState(true);

  const { script } = useContext(ScriptChoiceContext);

  useEffect(() => {
    document.fonts.ready.then((fontFaceSet) => {
      const loadedFaces = [...fontFaceSet];

      fontsData.forEach((font) => {
        if (loadedFaces.find((f) => f.family === font.label)) return;

        const newFont = new FontFace(`${font.label}`, `url(${font.fontPath})`);

        newFont
          .load()
          .then(function (loaded_face) {
            document.fonts.add(loaded_face);
          })
          .catch(function (error) {
            console.error(error);
          });
      });
    });
  }, [fontsData]);

  useEffect(() => {
    const [sampleText, index] = buildSampleText(typetesterLanguageGroup, typetester.index, isLatin);
    setTypetester({ text: sampleText, index: index });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLatin]);

  useEffect(() => {
    if (script) {
      setIsLatin(script === "latin");
    }
  }, [script]);

  const containerOptions = useMemo(() => {
    return {
      contenteditable: `${isTextEditable}`,
      lang: `${sampleLang}`,
    };
  }, [isTextEditable, sampleLang]);

  const styleOptions = useMemo(() => {
    return {
      fontSize: `${fontSize}px`,
      fontFeatureSettings: buildOpentypeFeatures(features),
      textAlign: alignment as any,
      columnCount: textColumns,
      fontFamily: fontFamily.label,
    };
  }, [alignment, features, fontFamily, fontSize, textColumns]);

  const handleFontFamily = (e: any) => {
    const fontValue = e.value;
    const newFont = fontsData.find((f) => f.value === fontValue);

    if (newFont) setFontFamily(newFont);
  };

  const handleLanguage = (e: any) => {
    setSampleLang(e.value);
  };

  const handleFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(+e.target.value);
  };

  const handleOpentypeFeatures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFeatures = [...features];
    const featureId = e.target.id;

    const feature = updatedFeatures.find((f) => f.value === featureId);
    if (feature) {
      feature.checked = !feature.checked;
      setFeatures(updatedFeatures);
    }
  };

  const handleAlignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlignment(e.target.value);
  };

  const handleColumns = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColumns(+e.target.value);
  };

  const handleEditableClick = () => {
    if (isTextEditable === "plaintext-only") {
      setIsTextEditable("false");
    } else {
      setIsTextEditable("plaintext-only");

      if (fontTesterRef.current) {
        setTimeout(() => {
          fontTesterRef.current!.focus();
          window.getSelection()?.selectAllChildren(fontTesterRef.current!);
          window.getSelection()?.collapseToEnd();
        }, 0);
      }
    }
  };

  const handleFontSampleClick = () => {
    if (isTextEditable !== "false") return;
    const [sampleText, index] = buildSampleText(typetesterLanguageGroup, typetester.index, isLatin);
    setTypetester({ ...typetester, text: sampleText, index: index });
  };

  return (
    <article className="font-tester" id={fontFamily.value}>
      <div className="font-tester-header">
        <div
          className="fontfamily"
          style={{ "--min-width": countMaxLabelLength(fontsData) } as React.CSSProperties}
        >
          <Dropdown
            className="dropdown"
            options={fontsData}
            onChange={handleFontFamily}
            value={fontFamily.value}
            arrowClosed={<Iconly icon={icons.chevronUp} />}
            arrowOpen={<Iconly icon={icons.chevronDown} />}
          />
        </div>
        <div
          className="lang"
          style={{ "--min-width": countMaxLabelLength(languages) } as React.CSSProperties}
        >
          <Dropdown
            className="dropdown"
            options={languages}
            onChange={handleLanguage}
            placeholder="Language"
            arrowClosed={<Iconly icon={icons.chevronUp} />}
            arrowOpen={<Iconly icon={icons.chevronDown} />}
          />
        </div>
        <div className="fontsize slider">
          <label>
            <span className="fontsize-value">{fontSize}px</span>
          </label>
          <input onInput={handleFontSize} type="range" min="12" max="192" value={fontSize} />
        </div>
        <div className="opentype-features">
          <CheckboxDropdown
            dropdownItems={opentypeFeatures}
            handleOnChange={handleOpentypeFeatures}
          />
        </div>
        <div className="alignment">
          {alignmentOptions.map((option) => (
            <>
              <label
                htmlFor={`${option.value}-${fontFamily.value}`}
                className={alignment === option.value ? "active" : ""}
                title={option.label}
              >
                <Iconly icon={icons[option.label]} />
              </label>
              <input
                type="radio"
                id={`${option.value}-${fontFamily.value}`}
                name="alignment"
                value={option.value}
                checked={alignment === option.value}
                onChange={handleAlignment}
              />
            </>
          ))}
        </div>
        <div className="columns">
          {columnOptions.map((option) => (
            <>
              <label htmlFor={`${option.value}-${fontFamily.value}`} title={option.label}>
                <Iconly icon={icons[option.label]} />
              </label>
              <input
                type="radio"
                id={`${option.value}-${fontFamily.value}`}
                name="textcolumns"
                value={option.value}
                checked={textColumns == option.value}
                onChange={handleColumns}
              />
            </>
          ))}
        </div>
        <div className="edit-text">
          <button className="edit-button" onClick={() => handleEditableClick()}>
            {isTextEditable === "false" ? "Edit text" : "Editing"}
          </button>
        </div>
      </div>
      <div
        ref={fontTesterRef}
        className="font-sample"
        onClick={handleFontSampleClick}
        {...staticOptions}
        {...containerOptions}
        style={styleOptions}
      >
        {typetester.text}
      </div>
    </article>
  );
}

const buildSampleText = (
  typetesterLanguageGroup: TypetesterTextGroup[] | undefined,
  index: number | null = null,
  isLatin = true
) => {
  if (!typetesterLanguageGroup) return ["Type something here", 0];

  const { allSamplesLatin, allSamplesCyrillic } = indexAllSamples(typetesterLanguageGroup);
  const samples = isLatin ? allSamplesLatin : allSamplesCyrillic;

  if (!index) {
    index = getRandomIndex(0, samples?.length);
  } else {
    index++;
    if (index >= samples?.length) {
      index = 0;
    }
  }

  const randomText = samples[index!]?.text;
  return [randomText, index];
};

const buildOpentypeFeatures = (features: any) => {
  let validFeatures = [];

  for (const item of features) {
    if (item.checked === true) {
      validFeatures.push(`"${item.value}"`);
    } else {
      validFeatures.push(`"${item.value}" 0`);
    }
  }

  // special formatting as the font features require every attribute to in quotes, e.g font-feature-settings: "liga"
  return `${validFeatures.join(`, `)}`;
};

const countMaxLabelLength = (options: any) => {
  let maxLength = 7;

  options.forEach((option: { label: string }) => {
    const optionLength = option.label.length;
    if (maxLength < optionLength) maxLength = optionLength;
  });

  return `${maxLength - 1}ch`;
};
