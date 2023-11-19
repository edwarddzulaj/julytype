"use client";
import { Style, Typeface } from "@/@types/contentTypes";
import { TypefaceWeight } from "@/@types/components";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { addToCart, removeFromCart, CartItem } from "@/app/redux/cartReducer";

import BuyingPrice from "./BuyingPrice";
import { allStylesAndWeights, pluralize } from "@/app/utils/text-helpers";

export default function FontSelection({ typeface }: { typeface: Typeface }) {
  const { price, wholePackageDiscount, styles } = typeface.attributes;
  const { numStyles, numWeights, allWeights } = useMemo(() => {
    return allStylesAndWeights(styles.data);
  }, [styles.data]);

  const [wholePackageSelected, setWholePackageSelected] = useState(false);
  const weightRefs = useRef<Array<HTMLInputElement | null>>([]);

  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

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

  const handleOptionChange = (weight: TypefaceWeight | null) => {
    if (!weight) {
      // setSelectedOption("whole"); //TODO: implement adding the whole typeface
    } else {
      // setSelectedOption(weight.title);

      const item: CartItem = {
        id: typeface.id,
        name: typeface.attributes.title,
        weight: weight,
        licenseType: "desktop",
        companySize: 10,
        discount: false,
        wholePackage: false,
      };

      if (cart.products.find((addedItem) => addedItem.weight?.id === weight.id)) {
        dispatch(removeFromCart(item));
      } else {
        dispatch(addToCart(item));
      }
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
                        defaultChecked={
                          !!cart.products.find((product) => product.weight.id === weight.id)
                        }
                        onClick={() =>
                          handleOptionChange({
                            ...weight,
                            title: fullTitle,
                          })
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
