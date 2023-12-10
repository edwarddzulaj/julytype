import { TypefaceWeight } from "@/@types/components";

import { removeFromCart, ProductItem } from "@/app/redux/cartReducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Iconly, { icons } from "../../UI/Iconly";
import Link from "next/link";
import { licenseOptions } from "../PurchaseSection/purchase-option-configs";
import { pluralize } from "@/app/utils/text-helpers";
import { calculateTotalPrices } from "@/app/utils/cart-helpers";

export default function ProductItemContainer({ item }: { item: ProductItem }) {
  const [allWeights, setAllWeights] = useState("");
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });

  const dispatch = useDispatch();

  useEffect(() => {
    setAllWeights(combineAllTitles(item.weights));

    const { totalPrice, discountPrice } = calculateTotalPrices(
      item.weights,
      item.licenseTypes,
      [item.companySize.toString()],
      item.discount
    );
    setPrices({ price: totalPrice, finalPrice: discountPrice });
  }, [item.companySize, item.discount, item.licenseTypes, item.weights]);

  const removeProductItem = () => {
    item.weights.forEach((weight) => {
      dispatch(removeFromCart({ weight: { id: weight.id } }));
    });
  };

  const licensesString = buildLicenseString(item.licenseTypes);

  function buildLicenseString(licenseTypes: string[]) {
    let licenses: string[] = [];
    licenseTypes.forEach((licenseTypeValue) => {
      const licenseOption = licenseOptions.options.find((o) => o.value === licenseTypeValue);
      if (licenseOption) {
        licenses.push(licenseOption.label);
      }
    });

    return licenses.join(", ");
  }

  return (
    <section className="cart-item-container">
      <article className="details">
        <div>
          <h6 className="title">Weights and styles</h6>
          {allWeights}
        </div>
        <div>
          <h6 className="title">License {pluralize(item.licenseTypes.length, "Type", false)}</h6>
          {licensesString}
        </div>
        <div>
          <h6 className="title">Company Size</h6>
          Less than {item.companySize}
        </div>
        <div>
          <h6 className="title">Price</h6>
          <div>
            {prices.price !== prices.finalPrice && (
              <>
                <span className="price">{prices.price} EUR</span>&nbsp;
              </>
            )}
            <span className="discount-price">{prices.finalPrice} EUR</span>
          </div>
        </div>
      </article>
      <article className="actions">
        <div className="remove-action" onClick={removeProductItem}>
          Remove from cart <Iconly icon={icons.close}></Iconly>
        </div>
        <Link
          className="edit-action"
          href={`/typefaces/${item.name.toLowerCase()}#font-selection-options`}
        >
          Edit buying options
        </Link>
      </article>
    </section>
  );
}

function combineAllTitles(weights: Array<TypefaceWeight>) {
  let allWeights: Array<string> = [];
  weights.forEach((weight: TypefaceWeight) => {
    allWeights.push(weight.title);
  });

  return allWeights.join(", ");
}
