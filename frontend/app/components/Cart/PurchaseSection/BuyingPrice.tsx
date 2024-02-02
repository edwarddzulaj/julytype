import { calculatePrices } from "@/app/utils/cart-helpers";
import { BuyingPrice } from "./PurchaseSectionTypes";
import DiscountBadge from "../../UI/DiscountBadge";

export default function BuyingPrice({ price, discount, purchaseDetails }: BuyingPrice) {
  const [regularPrice, priceWithDiscount] = calculatePrices(
    { price: price, discount: discount },
    purchaseDetails
  );

  return (
    <span className={`buying-price${discount ? " with-discount" : ""}`}>
      {discount && (
        <>
          <DiscountBadge discountPercent={discount} />
          <span className="discount-old-price">{regularPrice} EUR</span>
          <span className="price">{priceWithDiscount} EUR</span>
        </>
      )}
      {!discount && <span className="price">{regularPrice} EUR</span>}
    </span>
  );
}
