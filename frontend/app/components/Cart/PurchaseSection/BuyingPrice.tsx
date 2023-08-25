import { BuyingPrice } from "./PurchaseSectionTypes";

export default function BuyingPrice({ discount, price }: BuyingPrice) {
  const finalPrice = discount ? Math.ceil(price - price * (discount / 100)) : price;

  return (
    <div>
      {discount && (
        <span>
          <label className="discount-label">Save {discount}%</label>
          <span className="discount-old-price">{price} EUR</span>
          <span className="discount-price">{finalPrice} EUR</span>
        </span>
      )}
      {!discount && <span>{finalPrice} EUR</span>}
    </div>
  );
}
