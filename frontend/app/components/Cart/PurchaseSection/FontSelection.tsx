"use client";
import { Style, Typeface } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";
import { useEffect, useMemo, useRef, useState } from "react";

import { allStylesAndWeights, pluralize } from "@/app/utils/text-helpers";
import BuyingPrice from "./BuyingPrice";
import { SelectedItem } from "@/app/redux/cartReducer";
import { PurchaseDetails } from "./PurchaseSectionTypes";

export default function FontSelection({
  typeface,
  selectedItems,
  setSelectedItems,
  purchaseDetails,
  setPurchaseDetails,
}: {
  typeface: Typeface;
  selectedItems: SelectedItem[];
  setSelectedItems: Function;
  purchaseDetails: PurchaseDetails;
  setPurchaseDetails: Function;
}) {
  const { title, price, wholePackageDiscount, styles, variableFont } = typeface.attributes;
  const { numStyles, numWeights, allWeights } = useMemo(() => {
    return allStylesAndWeights(styles.data);
  }, [styles.data]);

  const [wholePackageSelected, setWholePackageSelected] = useState(false);
  const weightRefs = useRef<Array<HTMLInputElement | null>>([]);
  const variableFontRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    weightRefs.current = weightRefs.current.slice(0, allWeights.length);
  }, [allWeights]);

  useEffect(() => {
    if (wholePackageSelected) {
      weightRefs.current.forEach((ref) => {
        ref!.checked = true;
        ref!.disabled = true;
      });

      if (variableFont) {
        variableFontRef!.current!.checked = true;
        variableFontRef!.current!.disabled = true;
      }
    } else {
      weightRefs.current.forEach((ref) => {
        ref!.checked = false;
        ref!.disabled = false;
      });

      if (variableFont) {
        variableFontRef!.current!.checked = false;
        variableFontRef!.current!.disabled = false;
      }
    }
  }, [variableFont, wholePackageSelected]);

  useEffect(() => {
    setWholePackageSelected(purchaseDetails.wholePackageDiscount);
  }, [purchaseDetails]);

  const handleOptionChange = (weight: SelectedItem | undefined, styleId: number | undefined) => {
    if (
      selectedItems.some((addedItem) => addedItem.id === weight!.id && !addedItem.isVariableFont)
    ) {
      setSelectedItems(
        selectedItems.filter((i) => {
          if (i.isVariableFont) return true;
          return i.id !== weight!.id;
        })
      );
    } else {
      setSelectedItems([...selectedItems, { ...weight, styleId: styleId }]);
    }
  };

  const handleVariableOptionChange = (variableWeight: TypefaceWeight) => {
    if (
      selectedItems.some(
        (addedItem) => addedItem.id === variableWeight!.id && addedItem.isVariableFont
      )
    ) {
      setSelectedItems(
        selectedItems.filter((i) => {
          if (!i.isVariableFont) return true;
          return i.id !== variableWeight!.id;
        })
      );
    } else {
      setSelectedItems([...selectedItems, { ...variableWeight, isVariableFont: true }]);
    }
  };

  const toggleWholePackage = () => {
    if (!wholePackageSelected) {
      setPurchaseDetails({ ...purchaseDetails, wholePackageDiscount: true });
      setWholePackageSelected(true);

      const allItems = getAllItems(true);
      if (allItems) {
        setSelectedItems([...selectedItems, ...allItems]);
      }
    } else {
      setPurchaseDetails({ ...purchaseDetails, wholePackageDiscount: false });
      setWholePackageSelected(false);

      const allItems = getAllItems();
      setSelectedItems(selectedItems.filter((item) => !allItems.some((i) => i.id === item.id)));
    }
  };

  const getAllItems = (intersectWithSelectedItems = false) => {
    const allItems: SelectedItem[] = [];

    styles.data.forEach((style) => {
      style.attributes.weights.forEach((weight) => {
        const fullTitle = `${style.attributes.title} ${weight.title}`;
        allItems.push({ ...weight, styleId: style.id, title: fullTitle });
      });
    });

    allItems.push({
      ...variableFont,
      title: `${title} Variable`,
      isVariableFont: true,
    });

    if (intersectWithSelectedItems) {
      return allItems.filter((item) => !selectedItems.some((i) => i.id === item.id));
    } else {
      return allItems;
    }
  };

  return (
    <article className="font-selection">
      <form>
        <div>
          <p>Buy the whole family</p>
          <div className="typeface-package">
            <div className="typeface-details">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  value="whole"
                  onChange={toggleWholePackage}
                  checked={wholePackageSelected}
                />
                <label>{title} Family Complete Pack</label>
              </div>
              <p className="styles-and-weights">
                Includes {pluralize(numStyles, "Style")} • {pluralize(numWeights, "Weight")}:{" "}
                {allWeights.join(", ")} {variableFont && `and ${title} Variable`}
              </p>
            </div>
            <div className="typeface-price">
              <BuyingPrice
                price={price}
                discount={wholePackageDiscount}
                purchaseDetails={purchaseDetails}
              />
            </div>
          </div>
        </div>
        <div>
          <h6>Choose individual weights</h6>
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
                        checked={selectedItems.some(
                          (item) => !item.isVariableFont && item.id === weight.id
                        )}
                        onChange={() =>
                          handleOptionChange(
                            {
                              ...weight,
                              title: fullTitle,
                              typetesterLanguageGroup: [],
                              fontFile: [],
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
                    <BuyingPrice
                      price={weight.price}
                      discount={weight.discount}
                      purchaseDetails={purchaseDetails}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
        {variableFont && (
          <div>
            <h6>Or go variable</h6>
            <div className="typeface-package">
              <div className="typeface-details">
                <div className="checkbox-option">
                  <input
                    ref={variableFontRef}
                    type="checkbox"
                    value="variable"
                    checked={selectedItems.some(
                      (item) => item.isVariableFont && item.id === variableFont.id
                    )}
                    onChange={() =>
                      handleVariableOptionChange({
                        ...variableFont,
                        title: `${title} Variable`,
                      })
                    }
                  />
                  <label>{title} Variable</label>
                </div>
                {numStyles > 1 && (
                  <p className="styles-and-weights">Includes variable weights and optical sizing</p>
                )}
              </div>
              <BuyingPrice
                price={variableFont.price}
                discount={variableFont.discount}
                purchaseDetails={purchaseDetails}
              />
            </div>
          </div>
        )}
      </form>
    </article>
  );
}
