"use client";
import { Style, Typeface } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";
import { useEffect, useMemo, useRef, useState } from "react";

import BuyingPrice from "./BuyingPrice";
import { allStylesAndWeights, pluralize } from "@/app/utils/text-helpers";

export default function FontSelection({
  typeface,
  selectedItems,
  setSelectedItems,
}: {
  typeface: Typeface;
  selectedItems: TypefaceWeight[];
  setSelectedItems: Function;
}) {
  const { price, wholePackageDiscount, styles } = typeface.attributes;
  const { numStyles, numWeights, allWeights } = useMemo(() => {
    return allStylesAndWeights(styles.data);
  }, [styles.data]);

  const [wholePackageSelected, setWholePackageSelected] = useState(false);
  const weightRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    weightRefs.current = weightRefs.current.slice(0, allWeights.length);
  }, [allWeights]);

  useEffect(() => {
    if (wholePackageSelected) {
      weightRefs.current.forEach((ref) => {
        ref!.checked = true;
        ref!.disabled = true;
      });
    } else {
      weightRefs.current.forEach((ref) => {
        // ref!.checked = false;
        ref!.disabled = false;
      });
    }
  }, [wholePackageSelected]);

  const handleOptionChange = (weight: TypefaceWeight | undefined, styleId: number) => {
    if (!weight) {
      // setSelectedOption("whole"); //TODO: implement adding the whole typeface
    } else {
      // setSelectedOption(weight.title);
    }

    if (selectedItems.find((addedItem) => addedItem.id === weight!.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== weight!.id));
    } else {
      setSelectedItems([...selectedItems, weight]);
    }
  };

  const toggleWholePackage = () => {
    setWholePackageSelected(!wholePackageSelected);
  };

  return (
    <article className="font-selection">
      <form>
        <div>
          <h6>Buy the whole package</h6>
          <div className="typeface-package">
            <div className="typeface-details">
              <div className="checkbox-option">
                <input type="checkbox" value="whole" onClick={toggleWholePackage} />
                <label>{typeface.attributes.title} Family Complete Pack</label>
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
              style.attributes.weights.map((weight) => {
                const fullTitle = `${style.attributes.title} ${weight.title}`;
                return (
                  <div className="weight-details" key={weight.id}>
                    <div className="checkbox-option">
                      <input
                        ref={(el) => (weightRefs.current[allWeights.indexOf(fullTitle)] = el)}
                        type="checkbox"
                        value={weight.id}
                        defaultChecked={!!selectedItems.find((item) => item.id === weight.id)}
                        onClick={() =>
                          handleOptionChange(
                            {
                              ...weight,
                              title: fullTitle,
                            },
                            style.id
                          )
                        }
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
                );
              })
            )}
          </div>
        </div>
      </form>
    </article>
  );
}
