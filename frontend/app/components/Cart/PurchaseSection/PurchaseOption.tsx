"use client";

import { useEffect, useState } from "react";
import { PurchaseOption } from "./PurchaseSectionTypes";

import DiscountBadge from "../../UI/DiscountBadge";
import { Tooltip } from "../../UI/Tooltip";
import InfoText from "../../UI/InfoText";

export default function PurchaseOption({
  config,
  setCallback,
  selectedOption,
  optionType = "radio",
  requireOneCheckbox = false,
}: {
  config: PurchaseOption<string | number>;
  setCallback: Function;
  selectedOption?: string[] | number | undefined;
  optionType?: "radio" | "checkbox";
  requireOneCheckbox?: boolean;
}) {
  const { subtitle, options, info, extraInfo } = config;
  const defaultOption = options.find((o) => o.checked);
  const [selectedOptions, setSelectedOptions] = useState([defaultOption?.value]);

  const handleOptionChange = (value: string | number) => {
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

  const checkForSelectedOption = (option: any) => {
    if (selectedOption) {
      if (Array.isArray(selectedOption)) {
        return selectedOption.includes(option.value);
      } else {
        return selectedOption === option.value;
      }
    }

    return option.checked;
  };
  return (
    <article className="purchase-option">
      <div>
        {subtitle && <h6>{subtitle}</h6>}
        <div className={`options ${optionType}`}>
          <form>
            {options.map((option) => (
              <div key={option.label} className="option-row">
                <div>
                  <label className={checkForSelectedOption(option) ? "selected" : ""}>
                    <input
                      type={optionType}
                      name="option"
                      value={option.value}
                      disabled={
                        requireOneCheckbox &&
                        selectedOptions.length <= 1 &&
                        selectedOptions.includes(option.value)
                      }
                      checked={checkForSelectedOption(option)}
                      onChange={() => handleOptionChange(option.value)}
                    />
                    {option.label}
                  </label>
                  {option.note && (
                    <span className="note">
                      <Tooltip id={option.label} content={option.note} />
                    </span>
                  )}
                </div>
                {option.discount && !checkForSelectedOption(option) && (
                  <span className="discount">
                    <DiscountBadge discountPercent={option.discount.percent} />
                  </span>
                )}
              </div>
            ))}
          </form>
        </div>
        {info && <InfoText info={info} />}
        {extraInfo && <InfoText info={extraInfo} attributes={{ className: "info-text warning" }} />}
      </div>
    </article>
  );
}
