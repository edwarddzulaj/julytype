import { TypefaceWeight } from "@/@types/components";
import { CartItem } from "../redux/cartReducer";
import { licenseRates } from "./license-helpers";
import { PurchaseDetails } from "../components/Cart/PurchaseSection/PurchaseSectionTypes";

export const calculatePrices = (
  prices: {
    price: number;
    discount: number | undefined;
  } = { price: 0, discount: undefined },
  purchaseDetails: PurchaseDetails | undefined
) => {
  let price = applyAllLicenses(purchaseDetails, prices.price);

  if (purchaseDetails?.studentDiscount) {
    price = price * 0.5;
  }

  let discountPrice = prices.discount ? Math.ceil(price - price * (prices.discount / 100)) : price;

  return [roundToTwoDecimalPlaces(price), roundToTwoDecimalPlaces(discountPrice)];
};

export const calculateTotalPricesForCart = (items: Array<CartItem>) => {
  let totalPriceCart = 0;
  let discountPriceCart = 0;

  items.forEach((item) => {
    const { totalPrice, discountPrice } = calculateTotalPrices(item.weights, item.purchaseDetails);
    totalPriceCart += totalPrice;
    discountPriceCart += discountPrice;
  });

  return { totalPriceCart, discountPriceCart };
};

export const calculateTotalPrices = (
  weights: TypefaceWeight[],
  purchaseDetails: PurchaseDetails
) => {
  let totalPrice = 0;
  let discountPrice = 0;

  weights.forEach((weight) => {
    const [price, priceWithDiscount] = calculatePrices(
      { price: weight.price, discount: weight.discount },
      purchaseDetails
    );
    totalPrice += price;
    discountPrice += priceWithDiscount;
  });

  return {
    totalPrice: roundToTwoDecimalPlaces(totalPrice),
    discountPrice: roundToTwoDecimalPlaces(discountPrice),
  };
};

function applyAllLicenses(purchaseDetails: PurchaseDetails | undefined, initialPrice: number) {
  const licenseTypes = purchaseDetails?.licenseTypes || ["desktop-print"];
  let price = 0;

  licenseTypes.forEach((licenseType: string, i: number) => {
    const companySize = purchaseDetails?.companySize || 1;

    const multiplyRate = licenseRates[licenseType as keyof licenseRates][companySize];
    const secondLicenseDiscount = i > 0 ? 0.7 : 1;
    price += initialPrice * multiplyRate * secondLicenseDiscount;
  });

  return price;
}
export function roundToTwoDecimalPlaces(number: number) {
  if (Number.isInteger(number)) {
    return number;
  } else {
    return Math.round(number * 100) / 100;
  }
}
