"use client";

import { BASE_TEXT, options } from "./opentype-features-preview-config";
import PurchaseOption from "../../Cart/PurchaseSection/PurchaseOption";
import { useEffect, useRef, useState } from "react";

export default function OpentypeFeaturesPreview({ fontFamilyTitle }: { fontFamilyTitle?: string }) {
  const TEXT_SIZE = 64;
  const textRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  const mappedOptions = {
    options: options.map((option) => ({
      value: option.id,
      label: option.label,
      checked: option.checked,
    })),
  };

  useEffect(() => {
    updateStyles(textRef, selectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  const updateStyles = (textRef: any, selectedOption: string[]) => {
    const allSpans = textRef.current.querySelectorAll("span");
    allSpans.forEach((span: HTMLDivElement) => {
      const activeName = `${Array.from(span.classList).find((c) => c === selectedOption[0])}-on`;
      if (span.classList.contains(selectedOption[0])) {
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
        selectedOption={selectedOption}
        setCallback={(optionValues: string[]) => setSelectedOption(optionValues)}
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
