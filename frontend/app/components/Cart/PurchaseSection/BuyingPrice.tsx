import { BuyingPrice } from "./PurchaseSectionTypes";

export default function BuyingPrice({ discount, price }: BuyingPrice) {
  const finalPrice = discount ? Math.ceil(price - price * (discount / 100)) : price;

  return (
    <span className={`buying-price${discount ? " with-discount" : ""}`}>
      {discount && (
        <>
          <label className="discount-label">Save {discount}%</label>
          <span className="discount-old-price">{price} EUR</span>
          <span className="price">{finalPrice} EUR</span>
        </>
      )}
      {!discount && <span className="price">{finalPrice} EUR</span>}
    </span>
  );
}
