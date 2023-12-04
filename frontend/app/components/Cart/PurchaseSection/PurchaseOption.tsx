"use client";

import { useEffect, useState } from "react";
import { PurchaseOption } from "./PurchaseSectionTypes";
import Link from "next/link";
import Iconly, { icons } from "@/app/components/UI/Iconly";

export default function PurchaseOption({
  config,
  setCallback,
  optionType = "radio",
}: {
  config: PurchaseOption;
  setCallback: Function;
  optionType?: "radio" | "checkbox";
}) {
  const { subtitle, options, info } = config;
  const defaultOption = options.find((o) => o.checked);
  const [selectedOptions, setSelectedOptions] = useState([defaultOption?.value] || null);

  const handleOptionChange = (value: string) => {
    if (optionType === "checkbox") {
      if (selectedOptions.includes(value)) {
        setSelectedOptions([...selectedOptions.filter((o) => o !== value)]);
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      setSelectedOptions([value]);
    }
  };

  useEffect(() => {
    setCallback(selectedOptions);
  }, [selectedOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article className="purchase-option">
      <div>
        {subtitle && <h6>{subtitle}</h6>}
        <div className={`options ${optionType}`}>
          <form>
            {options.map((option) => (
              <label
                key={option.value}
                className={selectedOptions.includes(option.value) ? "selected" : ""}
              >
                <input
                  type={optionType}
                  name="option"
                  value={option.value}
                  defaultChecked={option.checked}
                  onClick={() => handleOptionChange(option.value)}
                />
                {option.label}
                {option.note && (
                  <div className="note">
                    <Iconly icon={icons.info} />
                    <p className="text">{option.note}</p>
                  </div>
                )}
              </label>
            ))}
          </form>
        </div>
        {info && (
          <Link href={info.url}>
            <Iconly icon={icons.info} />
            {info.text}
          </Link>
        )}
      </div>
    </article>
  );
}
