"use client";

import { useEffect, useMemo, useState } from "react";
import Dropdown from "react-dropdown";
import CheckboxDropdown from "../../UI/CheckboxDropdown";
import { FontsData } from "./typetester-types";

import {
  staticOptions,
  languages,
  opentypeFeatures,
  alignmentOptions,
  columnOptions,
} from "./typetester-config";

import Iconly, { icons } from "../../UI/Iconly";

export default function Typetester({
  typetesterText = "Type something...",
  fontsData = [
    {
      label: "Font",
      value: "font",
      fontPath: "",
    },
  ],
}: {
  typetesterText?: string | undefined;
  fontsData: FontsData[];
}) {
  const [fontFamily, setFontFamily] = useState(fontsData[0]);
  const [sampleLang, setSampleLang] = useState(languages[0].value);
  const [fontSize, setFontSize] = useState(48);
  const [features, setFeatures] = useState(opentypeFeatures);
  const [alignment, setAlignment] = useState(alignmentOptions[0].value);
  const [textColumns, setTextColumns] = useState(1);
  const [isTextEditable, setIsTextEditable] = useState("false");

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
    }
  };

  return (
    <article className="font-tester">
      <div className="font-tester-header">
        <div className="fontfamily">
          <Dropdown
            className="dropdown"
            options={fontsData}
            onChange={handleFontFamily}
            value={fontFamily.value}
            arrowClosed={<Iconly icon={icons.chevronUp} />}
            arrowOpen={<Iconly icon={icons.chevronDown} />}
          />
        </div>
        <div className="lang">
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
            <span className="fontsize-value">{fontSize}</span>
            <span>px</span>
          </label>
          <input
            onInput={handleFontSize}
            type="range"
            min="12"
            max="192"
            step="1"
            value={fontSize}
          />
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
              <label htmlFor={option.value} title={option.label}>
                {option.label}
              </label>
              <input
                type="radio"
                id={option.value}
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
              <label htmlFor={option.label.split(" ")[0]} title={option.label}>
                {option.label}
              </label>
              <input
                type="radio"
                id={option.label.split(" ")[0]}
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
      <div className="font-tester" {...staticOptions} {...containerOptions} style={styleOptions}>
        {typetesterText}
      </div>
    </article>
  );
}

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
