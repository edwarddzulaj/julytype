import { CartItem } from "../redux/cartReducer";
import { licenseRates, specialRules } from "./license-helpers";
import { PurchaseDetails } from "../components/Cart/PurchaseSection/PurchaseSectionTypes";
import { SelectedItem } from "../redux/cartReducer";

export const calculatePrices = (
  prices: {
    price: number;
    discount: number | undefined;
  } = { price: 0, discount: undefined },
  purchaseDetails: PurchaseDetails | undefined
) => {
  let price = applyAllLicenses(purchaseDetails, prices.price);

  if (purchaseDetails?.studentDiscount) {
    price = price * 0.2;
  }

  let discountPrice = prices.discount ? Math.ceil(price - price * (prices.discount / 100)) : price;

  return [roundToTwoDecimalPlaces(price), roundToTwoDecimalPlaces(discountPrice)];
};

export const calculateTotalPricesForCart = (items: Array<CartItem>) => {
  let totalPriceCart = 0;
  let discountPriceCart = 0;

  items.forEach((item) => {
    const { totalPrice, discountPrice } = calculateTotalPrices(
      item.weights,
      item.purchaseDetails,
      item.wholePackagePrices
    );
    totalPriceCart += totalPrice;
    discountPriceCart += discountPrice;
  });

  return { totalPriceCart, discountPriceCart };
};

export const calculateTotalPrices = (
  weights: SelectedItem[],
  purchaseDetails: PurchaseDetails,
  wholePackagePrices?: { price: number; discount: number }
) => {
  let totalPrice = 0;
  let discountPrice = 0;

  if (wholePackagePrices && purchaseDetails.wholePackageDiscount) {
    const [price, priceWithDiscount] = calculatePrices(
      { price: wholePackagePrices.price, discount: wholePackagePrices.discount },
      purchaseDetails
    );

    totalPrice = price;
    discountPrice = priceWithDiscount;
  } else {
    const variableWeight = weights.find((w) => w.isVariableFont);
    if (variableWeight) {
      const [price, priceWithDiscount] = calculatePrices(
        { price: variableWeight.price, discount: variableWeight.discount },
        purchaseDetails
      );

      totalPrice += price;
      discountPrice += priceWithDiscount;
    }

    weights
      .filter((w) => !w.isVariableFont)
      .forEach((weight, index) => {
        let bundleDiscount = 1;
        const [price, priceWithDiscount] = calculatePrices(
          { price: weight.price, discount: weight.discount },
          purchaseDetails
        );

        if (applyBundleDiscount(index)) {
          bundleDiscount = 0.5;
        }

        totalPrice += price * bundleDiscount;
        discountPrice += priceWithDiscount * bundleDiscount;
      });
  }

  return {
    totalPrice: roundToTwoDecimalPlaces(totalPrice),
    discountPrice: roundToTwoDecimalPlaces(discountPrice),
  };
};

export function roundToTwoDecimalPlaces(number: number) {
  if (Number.isInteger(number)) {
    return number;
  } else {
    return Math.round(number * 100) / 100;
  }
}

function applyBundleDiscount(index: number) {
  return (index + 1) % 2 === 0;
}

function applyAllLicenses(purchaseDetails: PurchaseDetails | undefined, initialPrice: number) {
  const licenseTypes = purchaseDetails?.licenseTypes || ["desktop-print"];
  const SECOND_LICENSE_DISCOUNT_FACTOR = 0.7;

  let price = 0;
  licenseTypes.forEach((licenseType: string, i: number) => {
    if (!(licenseType in licenseRates)) return;
    const companySize = purchaseDetails?.companySize || 1;

    let multiplyRate = licenseRates[licenseType as keyof licenseRates][companySize];
    if (specialRulesApply(purchaseDetails, licenseType)) {
      multiplyRate = 0;
    }

    const secondLicenseDiscount = i > 0 ? SECOND_LICENSE_DISCOUNT_FACTOR : 1;
    price += initialPrice * multiplyRate * secondLicenseDiscount;
  });

  return price;
}

function specialRulesApply(purchaseDetails: PurchaseDetails | undefined, licenseType: string) {
  const specialRuleMatrix = specialRules[licenseType as keyof specialRules];
  if (!purchaseDetails || !licenseType || !specialRuleMatrix) return;
  const { licenseTypes, companySize } = purchaseDetails;

  const hasLicenseTypesCombination = specialRuleMatrix.licenseTypesCombination.every((type) =>
    licenseTypes.includes(type)
  );
  const hasCompanySizesCombination = specialRuleMatrix.companySizeCombination.includes(companySize);

  return hasLicenseTypesCombination && hasCompanySizesCombination;
}
