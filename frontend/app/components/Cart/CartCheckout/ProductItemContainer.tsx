import { TypefaceWeight } from "@/@types/components";

import { removeFromCart, ProductItem } from "@/app/redux/cartReducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Iconly, { icons } from "../../UI/Iconly";
import Link from "next/link";

export default function ProductItemContainer({ item }: { item: ProductItem }) {
  const [allWeights, setAllWeights] = useState("");
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });

  const dispatch = useDispatch();

  useEffect(() => {
    setAllWeights(combineAllTitles(item.weights));
    setPrices(calculateTotalPrice(item.weights));
  }, [item.weights]);

  const removeProductItem = () => {
    item.weights.forEach((weight) => {
      dispatch(removeFromCart({ weight: { id: weight.id } }));
    });
  };

  return (
    <section className="cart-item-container">
      <article className="details">
        <div>
          <h6 className="title">Weights and styles</h6>
          {allWeights}
        </div>
        <div>
          <h6 className="title">License Type</h6>
          {item.licenseType}
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

function calculateTotalPrice(weights: Array<TypefaceWeight>) {
  let totalPrice = 0;
  let finalPrice = 0;

  weights.forEach((weight: TypefaceWeight) => {
    totalPrice += weight.price;
    finalPrice += weight.discount
      ? Math.ceil(weight.price - weight.price * (weight.discount / 100))
      : weight.price;
  });

  return { price: totalPrice, finalPrice: finalPrice };
}
