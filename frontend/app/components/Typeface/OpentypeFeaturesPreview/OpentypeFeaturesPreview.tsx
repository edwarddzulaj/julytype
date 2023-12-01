"use client";

import { BASE_TEXT, options } from "./opentype-features-preview-config";
import PurchaseOption from "../../Cart/PurchaseSection/PurchaseOption";
import { useEffect, useRef, useState } from "react";

export default function OpentypeFeaturesPreview({ fontFamilyTitle }: { fontFamilyTitle?: string }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState("");

  const mappedOptions = {
    options: options.map((option) => ({
      value: option.id,
      label: option.label,
      checked: option.checked,
    })),
  };

  const TEXT_SIZE = 64;

  useEffect(() => {
    updateStyles(textRef, selectedOption);
  }, [selectedOption]);

  const updateStyles = (textRef: any, selectedOption: string) => {
    const allSpans = textRef.current.querySelectorAll("span");
    allSpans.forEach((span: HTMLDivElement) => {
      const activeName = `${Array.from(span.classList).find((c) => c === selectedOption)}-on`;
      if (span.classList.contains(selectedOption)) {
        span.classList.add(activeName);
        span.classList.add("active");
      } else {
        span.classList.remove(activeName);
        span.classList.remove("active");
      }
    });
  };

  return (
    <div className="opentype-features-preview">
      <PurchaseOption
        config={mappedOptions}
        setCallback={(optionValue: string) => setSelectedOption(optionValue)}
      />
      <p
        className="text-container"
        ref={textRef}
        dangerouslySetInnerHTML={{ __html: BASE_TEXT }}
        style={{ fontFamily: fontFamilyTitle, fontSize: `${TEXT_SIZE}px` }}
      />
    </div>
  );
}
