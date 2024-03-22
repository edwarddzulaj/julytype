"use client";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import CheckboxDropdown from "../../UI/CheckboxDropdown";
import Dropdown from "../../UI/Dropdown";
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

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 250;
const TABLET_BREAKPOINT = 780;
const DESKTOP_BREAKPOINT = 1920;

export default function Typetester({
  fontsData = [
    {
      label: "Typeface Font",
      value: "font",
      fontPath: "",
    },
  ],
  selectedFontIndex = 0,
  typetesterLanguageGroup,
  defaultOptions,
}: {
  fontsData: FontsData[];
  selectedFontIndex?: number;
  typetesterLanguageGroup?: TypetesterTextGroup[] | undefined;
  defaultOptions?: {
    lineHeight?: number;
    fontFamily?: string;
    textColumns?: string;
  };
}) {
  const [isMobileView, setIsMobileView] = useState(false);
  const fontTesterRef = useRef<HTMLInputElement>(null);
  const [fontFamily, setFontFamily] = useState(fontsData[selectedFontIndex]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [sampleLang, setSampleLang] = useState(languages.latin[0]);
  const [fontSize, setFontSize] = useState(isMobileView ? 52 : 148);
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
  }, [isLatin, sampleLang, isMobileView]);

  useEffect(() => {
    document.fonts.ready.then((fontFaceSet) => {
      const loadedFaces = [...fontFaceSet];

      fontsData.forEach((font) => {
        if (loadedFaces.find((f) => f.family === font.label)) {
          setFontLoaded(true);
          return;
        }

        const newFont = new FontFace(`${font.label}`, `url(${font.fontPath})`);
        newFont
          .load()
          .then((loadedFace) => {
            document.fonts.add(loadedFace);
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
    setIsMobileView(window && window.innerWidth <= TABLET_BREAKPOINT);

    window.addEventListener("resize", () => {
      setIsMobileView(window.innerWidth <= TABLET_BREAKPOINT);
    });
  }, []);

  const containerOptions = useMemo(() => {
    return {
      contentEditable: `${isTextEditable}`,
      lang: `${sampleLang.value}`,
    };
  }, [isTextEditable, sampleLang]);

  const styleOptions = useMemo(() => {
    return {
      fontSize: adaptSizeToViewport(fontSize),
      fontFeatureSettings: buildOpentypeFeatures(features),
      textTransform: cases.find((c) => c.checked)?.value! as any,
      textAlign: alignment as any,
      lineHeight: adaptSizeToViewport(fontSize * lineHeight),
      columnCount: textColumns,
      fontFamily: fontLoaded ? fontFamily.label : "",
    };
  }, [alignment, cases, features, fontFamily.label, fontLoaded, fontSize, lineHeight, textColumns]);

  const handleFontFamily = (e: any) => {
    const fontValue = e.value;
    const newFont = fontsData.find((f) => f.value === fontValue);

    if (newFont) setFontFamily(newFont);
  };

  const handleLanguage = (e: any) => {
    setSampleLang(e);
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
      buildSampleText(typetesterLanguageGroup, typetester.index, isLatin, sampleLang.label);
    setFontSize(defaultFontSize);
    setAlignment(defaultAlignment);
    setTextColumns(defaultColumns);

    setTypetester({ text: sampleText, index: index });

    const langs = isLatin ? languages.latin : languages.cyrillic;
    const chosenLang = langs.find((l) => l.label.includes(sampleLanguage));

    if (chosenLang) {
      setSampleLang(chosenLang);
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
    <article
      className="font-tester"
      id={fontFamily.value}
      style={{ zIndex: 100 - selectedFontIndex }}
    >
      <div
        className={`font-tester-header${
          !(isMobileView && isTextEditable === "false") ? " mobile-view" : ""
        }`}
      >
        <div
          className="fontfamily typetester-button"
          style={{ "--min-width": countMaxLabelLength(fontsData) } as React.CSSProperties}
        >
          <Dropdown
            options={fontsData}
            instanceId={`${fontFamily.value}-font-family`}
            defaultValue={fontFamily}
            onChange={handleFontFamily}
          />
        </div>
        {!(isMobileView && isTextEditable === "false") && (
          <>
            <div className="fontsize slider extra-option typetester-button">
              <label htmlFor="fontsize">{fontSize.toFixed()}px</label>
              <input
                id="fontsize"
                onInput={handleFontSize}
                type="range"
                step="1"
                min={MIN_FONT_SIZE}
                max={MAX_FONT_SIZE}
                value={fontSize}
              />
            </div>
            <div className="inner-section">
              <div className="alignment extra-option typetester-button">
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
              <div className="columns extra-option typetester-button">
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
              <div
                className="lang extra-option typetester-button"
                style={
                  {
                    "--min-width": countMaxLabelLength(
                      isLatin ? languages.latin : languages.cyrillic
                    ),
                  } as React.CSSProperties
                }
              >
                <Dropdown
                  options={isLatin ? languages.latin : languages.cyrillic}
                  instanceId={`${fontFamily.value}-language`}
                  value={
                    isLatin
                      ? languages.latin.find((l) => l.label === sampleLang.label)
                      : languages.cyrillic.find((l) => l.label === sampleLang.label)
                  }
                  onChange={handleLanguage}
                  placeholder="Language"
                />
              </div>
            </div>
            <div className="inner-section">
              <div className="opentype-features extra-option typetester-button">
                <CheckboxDropdown
                  dropdownItems={opentypeFeatures}
                  handleOnChange={handleOpentypeFeatures}
                />
              </div>
              <div className="case-options extra-option typetester-button">
                <CheckboxDropdown
                  title="Change case"
                  dropdownItems={caseOptions}
                  handleOnChange={handleCaseOptions}
                />
              </div>
            </div>
          </>
        )}
        <div className="edit-text typetester-button">
          <button
            className={`edit-button ${isTextEditable === "false" ? "" : "editing"}`}
            onClick={(e) => handleEditableClick(e, fontTesterRef)}
          >
            {isTextEditable === "false" ? "Edit text" : "Editing"}
          </button>
        </div>
      </div>
      {/* @ts-ignore because contentEditable value is 'plaintext-only' and it demands a Boolean type*/}
      <div
        ref={fontTesterRef}
        className={`font-sample ${isTextEditable === "false" ? "" : "edit-mode"} ${
          textColumns === 1 ? "single-column" : "double-column"
        }`}
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
  isLatin = true,
  sampleLangLabel: string = ""
) => {
  if (!typetesterLanguageGroup || typetesterLanguageGroup.length === 0)
    return ["Type something here", 0];

  const { allSamplesLatin, allSamplesCyrillic } = indexAllSamples(typetesterLanguageGroup);
  let samples =
    !isLatin && Object.values(allSamplesCyrillic).length > 0 ? allSamplesCyrillic : allSamplesLatin;

  const sampleLanguage = sampleLangLabel in samples ? sampleLangLabel : Object.keys(samples)[0];
  samples = samples[sampleLanguage];

  if (!index) {
    index = getRandomIndex(0, samples?.length);
  } else {
    index++;
    if (index >= samples?.length) {
      index = 0;
    }
  }

  const randomText = samples[index!]?.text?.trim();
  const defaultSize = samples[index!]?.defaultFontSize || 148;
  const defaultAlignment = samples[index!]?.textAlignment || "center";
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

  // special formatting as the font-features require every attribute to be in quotes, e.g font-feature-settings: "liga"
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

const adaptSizeToViewport = (sizeNum: number) => {
  if (typeof window === "undefined") return `${sizeNum}px`;

  let multiplyRatio = 1;
  if (window.innerWidth < TABLET_BREAKPOINT) {
    multiplyRatio = 0.3;
  } else if (window.innerWidth < DESKTOP_BREAKPOINT) {
    multiplyRatio = 0.55;
  }

  const adaptedSize = (sizeNum / window.innerWidth) * multiplyRatio * 100;
  const adaptedSizeInVW = `${adaptedSize}vw`;

  return adaptedSizeInVW;
};
