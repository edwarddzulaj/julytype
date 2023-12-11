import { calculatePrices } from "@/app/utils/cart-helpers";
import { BuyingPrice } from "./PurchaseSectionTypes";

export default function BuyingPrice({ price, discount, purchaseDetails }: BuyingPrice) {
  const licenseType = purchaseDetails?.licenseTypes
    ? purchaseDetails.licenseTypes[0]
    : "desktop-print";
  const companySize = purchaseDetails?.companySize ? +purchaseDetails.companySize[0] : 1;
  const studentDiscount = purchaseDetails?.discount ? purchaseDetails.discount[0] === "yes" : false;

  const [regularPrice, priceWithDiscount] = calculatePrices(
    { price: price, discount: discount },
    licenseType,
    companySize,
    studentDiscount
  );

  return (
    <span className={`buying-price${discount ? " with-discount" : ""}`}>
      {discount && (
        <>
          <label className="discount-label">Save {discount}%</label>
          <span className="discount-old-price">{regularPrice} EUR</span>
          <span className="price">{priceWithDiscount} EUR</span>
        </>
      )}
      {!discount && <span className="price">{regularPrice} EUR</span>}
    </span>
  );
}
