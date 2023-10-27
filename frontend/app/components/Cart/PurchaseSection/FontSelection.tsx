"use client";
import { Style, Typeface } from "@/@types/contentTypes";
import { useState } from "react";

import BuyingPrice from "./BuyingPrice";
import { allStylesAndWeights, pluralize } from "@/app/utils/text-helpers";

export default function FontSelection({ typeface }: { typeface: Typeface["attributes"] }) {
  const { price, wholePackageDiscount, styles } = typeface;
  const { numStyles, numWeights, allWeights } = allStylesAndWeights(styles.data);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <article className="font-selection">
      <form>
        <div>
          <h6>Buy the whole package</h6>
          <div className="typeface-package">
            <div className="typeface-details">
              <div className="checkbox-option">
                <input type="checkbox" value="whole" onClick={() => handleOptionChange("whole")} />
                <label>{typeface.title} Family Complete Pack</label>
              </div>
              <div className="styles-and-weights">
                Includes {pluralize(numStyles, "Style")} • {pluralize(numWeights, "Weight")}:{" "}
                {allWeights.join(", ")}
              </div>
            </div>
            <div className="typeface-price">
              <BuyingPrice price={price} discount={wholePackageDiscount} />
            </div>
          </div>
        </div>
        <div>
          <h6>Choose individual styles</h6>
          <div className="weights-packages">
            {styles.data.map((style: Style) =>
              style.attributes.weights.map((weight) => (
                <div className="weight-details" key={weight.id}>
                  <div className="checkbox-option">
                    <input
                      type="checkbox"
                      value={weight.id}
                      onClick={() => handleOptionChange(weight.title)}
                    />
                    <label
                      className="weight-title"
                      style={{ fontFamily: `${style.attributes.title} ${weight.title}` }}
                    >
                      {style.attributes.title} {weight.title}
                    </label>
                  </div>
                  <BuyingPrice price={weight.price} discount={weight.discount} />
                </div>
              ))
            )}
          </div>
        </div>
      </form>
    </article>
  );
}
