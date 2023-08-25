"use client";
import { Typeface } from "@/@types/contentTypes";
import { useState } from "react";

import BuyingPrice from "./BuyingPrice";
import { allStylesAndWeights } from "@/app/utils/text-helpers";

export default function FontSelection({ typeface }: { typeface: Typeface["attributes"] }) {
  const { price, wholePackageDiscount, styles } = typeface;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  console.log(styles);
  const { numStyles, numWeights, allWeights } = allStylesAndWeights(styles.data);

  console.log(numStyles, numWeights, allWeights);
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
              <label>
                <input type="checkbox" value="whole" onClick={() => handleOptionChange("whole")} />
                {typeface.title} Family Complete Pack
              </label>
              <div>
                Includes {numStyles} Styles • {numWeights} Weights: {allWeights.join(", ")}
              </div>
            </div>
            <div className="typeface-price">
              <BuyingPrice price={price} discount={wholePackageDiscount} />
            </div>
          </div>
        </div>
        <div>
          <h6>Choose individual styles</h6>
        </div>
      </form>
    </article>
  );
}
