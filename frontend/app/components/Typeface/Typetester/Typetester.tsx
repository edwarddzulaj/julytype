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
  caseOptions,
  alignmentOptions,
  columnOptions,
} from "./typetester-config";

import Iconly, { icons } from "../../UI/Iconly";
import { ScriptChoiceContext } from "@/app/providers";

export default function Typetester({
  fontsData = [
    {
      title: "Typeface Font",
      label: "Font",
      value: "font",
      fontPath: "",
    },
  ],
  typetesterLanguageGroup,
  defaultOptions,
}: {
  fontsData: FontsData[];
  typetesterLanguageGroup?: TypetesterTextGroup[] | undefined;
  defaultOptions?: {
    lineHeight?: number;
    fontFamily?: string;
    textColumns?: string;
  };
}) {
  const [isMobileView, setIsMobileView] = useState(window && window.innerWidth <= 840);

  const fontTesterRef = useRef<HTMLInputElement>(null);
  const [fontFamily, setFontFamily] = useState(fontsData[0]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [sampleLang, setSampleLang] = useState(languages.latin[0].value);
  const [fontSize, setFontSize] = useState(isMobileView ? 38 : 108);
  const [features, setFeatures] = useState(opentypeFeatures);
  const [cases, setCases] = useState(caseOptions);
  const [alignment, setAlignment] = useState(alignmentOptions.find((f) => f.checked)?.value);
  const [lineHeight, setLineHeight] = useState(defaultOptions?.lineHeight || 1.4);
  const [textColumns, setTextColumns] = useState(1);
  const [isTextEditable, setIsTextEditable] = useState("false");
  const [typetester, setTypetester] = useState({ text: "", index: null });

  const [isLatin, setIsLatin] = useState(true);
  const { script } = useContext(ScriptChoiceContext);

  useEffect(() => {
    updateTextSample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLatin]);

  useEffect(() => {
    document.fonts.ready.then((fontFaceSet) => {
      const loadedFaces = [...fontFaceSet];

      fontsData.forEach((font) => {
        if (loadedFaces.find((f) => f.family === font.label)) return;
        const newFont = new FontFace(`${font.title}`, `url(${font.fontPath})`);

        newFont
          .load()
          .then(function (loaded_face) {
            document.fonts.add(loaded_face);
            setFontLoaded(true);
          })
          .catch(function (error) {
            console.error(error);
          });
      });
    });
  }, [fontsData]);

  useEffect(() => {
    if (script) {
      setIsLatin(script === "latin");
    }
  }, [script]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobileView(window.innerWidth <= 840);
    });
  }, []);

  const containerOptions = useMemo(() => {
    return {
      contentEditable: `${isTextEditable}`,
      lang: `${sampleLang}`,
    };
  }, [isTextEditable, sampleLang]);

  const styleOptions = useMemo(() => {
    return {
      fontSize: `${fontSize}px`,
      fontFeatureSettings: buildOpentypeFeatures(features),
      textTransform: cases.find((c) => c.checked)?.value! as any,
      textAlign: alignment as any,
      lineHeight: `${fontSize * lineHeight}px`,
      columnCount: textColumns,
      fontFamily: fontLoaded ? fontFamily.title : "",
    };
  }, [alignment, cases, features, fontFamily.title, fontLoaded, fontSize, lineHeight, textColumns]);

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

  const handleCaseOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCases = [...cases];
    const caseId = e.target.id;

    const caseType = caseOptions.find((c) => c.value === caseId);
    if (caseType) {
      updatedCases.map((c) => {
        if (c.value !== caseId) c.checked = false;
      });
      caseType.checked = !caseType.checked;
      setCases(updatedCases);
    }
  };

  const handleAlignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlignment(e.target.value);
  };

  const handleColumns = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColumns(+e.target.value);
  };

  const handleEditableClick = (e: any, fontTesterRef: any) => {
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

      const fontTesterContainer = fontTesterRef.current.parentNode;
      positionInTheMiddle(e.pageY, fontTesterContainer.clientHeight);
    }
  };

  const handleFontSampleClick = () => {
    if (isTextEditable !== "false") return;
    updateTextSample();
  };

  const updateTextSample = () => {
    const [sampleText, index, sampleLanguage, defaultFontSize, defaultAlignment, defaultColumns] =
      buildSampleText(typetesterLanguageGroup, typetester.index, isLatin);
    setFontSize(defaultFontSize);
    setAlignment(defaultAlignment);
    setTextColumns(defaultColumns);

    setTypetester({ text: sampleText, index: index });

    const langs = isLatin ? languages.latin : languages.cyrillic;
    const chosenLang = langs.find((l) => l.label === sampleLanguage);

    if (chosenLang) {
      setSampleLang(chosenLang!.value);
    }
  };

  const positionInTheMiddle = (divYPos: number, divHeight: number) => {
    const windowHeight = window.innerHeight;
    const middleY = divYPos + divHeight / 2 - windowHeight / 2;

    window.scrollTo({
      top: middleY,
      behavior: "smooth",
    });
  };

  return (
    <article className="font-tester" id={fontFamily.value}>
      <div
        className={`font-tester-header${
          !(isMobileView && isTextEditable === "false") ? " mobile-view" : ""
        }`}
      >
        <div
          className="fontfamily"
          style={{ "--min-width": countMaxLabelLength(fontsData) } as React.CSSProperties}
        >
          <Dropdown
            className="dropdown"
            options={fontsData}
            onChange={handleFontFamily}
            value={fontFamily.value}
            arrowClosed={<Iconly icon={icons.chevronDown} />}
            arrowOpen={<Iconly icon={icons.chevronUp} />}
          />
        </div>
        {!(isMobileView && isTextEditable === "false") && (
          <>
            <div
              className="lang extra-option"
              style={
                {
                  "--min-width": countMaxLabelLength(
                    isLatin ? languages.latin : languages.cyrillic
                  ),
                } as React.CSSProperties
              }
            >
              <Dropdown
                className="dropdown"
                options={isLatin ? languages.latin : languages.cyrillic}
                onChange={handleLanguage}
                placeholder="Language"
                arrowClosed={<Iconly icon={icons.chevronDown} />}
                arrowOpen={<Iconly icon={icons.chevronUp} />}
              />
            </div>
            <div className="fontsize slider extra-option">
              <label>
                <span className="fontsize-value">{fontSize}px</span>
              </label>
              <input onInput={handleFontSize} type="range" min="12" max="250" value={fontSize} />
            </div>
            <div className="opentype-features extra-option">
              <CheckboxDropdown
                dropdownItems={opentypeFeatures}
                handleOnChange={handleOpentypeFeatures}
              />
            </div>
            <div className="case-options extra-option">
              <CheckboxDropdown
                title="Change case"
                dropdownItems={caseOptions}
                handleOnChange={handleCaseOptions}
              />
            </div>
            <div className="alignment extra-option">
              {alignmentOptions.map((option) => (
                <span key={option.value}>
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
                </span>
              ))}
            </div>
            <div className="columns extra-option">
              {columnOptions.map((option) => (
                <span key={option.value}>
                  <label
                    htmlFor={`${option.value}-${fontFamily.value}`}
                    title={option.label}
                    className={textColumns === option.value ? "active" : ""}
                  >
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
                </span>
              ))}
            </div>
          </>
        )}
        <div className="edit-text">
          <button className="edit-button" onClick={(e) => handleEditableClick(e, fontTesterRef)}>
            {isTextEditable === "false" ? "Edit text" : "Editing"}
          </button>
        </div>
      </div>
      {/* @ts-ignore because contentEditable value is 'plaintext-only' and it demands a Boolean type*/}
      <div
        ref={fontTesterRef}
        className={`font-sample${isTextEditable === "false" ? "" : " edit-mode"}`}
        onClick={handleFontSampleClick}
        suppressContentEditableWarning={true}
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
  if (!typetesterLanguageGroup || typetesterLanguageGroup.length === 0)
    return ["Type something here", 0];

  const { allSamplesLatin, allSamplesCyrillic } = indexAllSamples(typetesterLanguageGroup);
  const samples = !isLatin && allSamplesCyrillic.length > 0 ? allSamplesCyrillic : allSamplesLatin;
  const sampleLanguage = samples[0].split(" ")[0];

  if (!index) {
    index = getRandomIndex(1, samples?.length);
  } else {
    index++;
    if (index >= samples?.length) {
      index = 1;
    }
  }

  const randomText = samples[index!]?.text.trim();
  const defaultSize = samples[index!]?.defaultFontSize || 108;
  const defaultAlignment = samples[index!]?.textAlignment || "left";
  const defaultColumns = samples[index!]?.twoColumns ? 2 : 1;

  return [randomText, index, sampleLanguage, defaultSize, defaultAlignment, defaultColumns];
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
