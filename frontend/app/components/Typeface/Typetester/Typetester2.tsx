"use client";
import { useMemo, useState } from "react";
import {
  staticOptions,
  languages,
  opentypeFeatures,
  alignmentOptions,
  columnOptions,
} from "./typetester-config";

export default function Typetester2({
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
  const [sampleLang, setSampleLang] = useState(languages[0].value);
  const [fontSize, setFontSize] = useState(48);
  const [features, setFeatures] = useState(opentypeFeatures);
  const [alignment, setAlignment] = useState(alignmentOptions[0].value);
  const [textColumns, setTextColumns] = useState(1);
  const [isTextEditable, setIsTextEditable] = useState("false");

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
      textAlign: alignment,
      columnCount: textColumns,
    };
  }, [alignment, features, fontSize, textColumns]);

  const handleSetLanguage = (e) => {
    setSampleLang(e.target.value);
  };

  const handleSetFontSize = (e) => {
    setFontSize(e.target.value);
  };

  const handleSetOpentypeFeatures = (e) => {
    const updatedFeatures = [...features];
    const featureId = e.target.id;

    const feature = updatedFeatures.find((f) => f.value === featureId);
    if (feature) {
      feature.checked = !feature.checked;
      setFeatures(updatedFeatures);
    }
  };

  const handleAlignment = (e) => {
    setAlignment(e.target.value);
  };

  const handleColumns = (e) => {
    setTextColumns(e.target.value);
  };

  const handleEditableClick = () => {
    if (isTextEditable === "plaintext-only") {
      setIsTextEditable("false");
    } else {
      setIsTextEditable("plaintext-only");
    }
  };

  return (
    <>
      <div className="font-tester-header">
        <div className="lang">
          <select onChange={handleSetLanguage} placeholder="Language">
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="fontsize">
          <label>
            <span className="fontsize-value">{fontSize}</span>
            <span>px</span>
          </label>
          <input
            onInput={handleSetFontSize}
            type="range"
            min="12"
            max="192"
            step="1"
            value={fontSize}
          />
        </div>
        <div className="opentype-features">
          <label htmlFor="">Features</label>
          <ul className="features">
            {opentypeFeatures.map((feature) => (
              <li key={feature.value}>
                <input
                  type="checkbox"
                  checked={feature.checked}
                  id={feature.value}
                  onChange={handleSetOpentypeFeatures}
                />
                <label htmlFor={feature.value}> {feature.label}</label>
              </li>
            ))}
          </ul>
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
    </>
  );
}

const buildOpentypeFeatures = (features) => {
  let validFeatures = [];

  for (const item of features) {
    if (item.checked === true) {
      validFeatures.push(item.value);
    }
  }

  // special formatting as the font features require every attribute to in quotes, e.g font-feature-settings: "liga"
  return `"${validFeatures.join(`", "`)}"`;
};
