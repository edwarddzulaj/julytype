"use client";

import Link from "next/link";
import { PurchaseOption } from "./PurchaseSectionTypes";
import Iconly, { icons } from "@/app/components/UI/Iconly";
import { useState } from "react";

export default function PurchaseOption({ config }: { config: PurchaseOption }) {
  const { subtitle, options, info } = config;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <article className="purchase-option">
      <div>
        <h6>{subtitle}</h6>
        <div className="options">
          <form>
            {options.map((option) => (
              <label
                key={option.value}
                className={selectedOption === option.value ? "selected" : ""}
              >
                <input
                  type="radio"
                  value={option.value}
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
