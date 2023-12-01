"use client";

import { useEffect, useState } from "react";
import { PurchaseOption } from "./PurchaseSectionTypes";
import Link from "next/link";
import Iconly, { icons } from "@/app/components/UI/Iconly";

export default function PurchaseOption({
  config,
  setCallback,
}: {
  config: PurchaseOption;
  setCallback: Function;
}) {
  const { subtitle, options, info } = config;
  const defaultOption = options.find((o) => o.checked);
  const [selectedOption, setSelectedOption] = useState<string | null>(defaultOption?.value || null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    setCallback(selectedOption);
  }, [selectedOption]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article className="purchase-option">
      <div>
        {subtitle && <h6>{subtitle}</h6>}
        <div className="options">
          <form>
            {options.map((option) => (
              <label
                key={option.value}
                className={selectedOption === option.value ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="option"
                  value={option.value}
                  defaultChecked={option.checked}
                  onClick={() => handleOptionChange(option.value)}
                />
                {option.label}
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
