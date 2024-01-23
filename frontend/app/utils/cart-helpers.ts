import { TypefaceWeight } from "@/@types/components";
import { ProductItem, CartItem } from "../redux/cartReducer";
import { licenseRates } from "./license-helpers";
import { PurchaseDetails } from "../components/Cart/PurchaseSection/PurchaseSectionTypes";

export function formatData(items: Array<CartItem>) {
  let typefaceProducts: Array<ProductItem> = [];

  items.forEach((item) => {
    const existingProduct = typefaceProducts.find((p) => p.id === item.id);
    const purchaseDetails = {
      licenseTypes: item.licenseTypes,
      companySize: item.companySize,
      studentDiscount: !!item.studentDiscount,
      wholePackageDiscount: !!item.wholePackageDiscount,
    };

    const [regularPrice, priceWithDiscount] = calculatePrices(
      { price: item.weight.price, discount: item.weight.discount },
      purchaseDetails
    );

    if (existingProduct) {
      existingProduct.weights.push({ ...item.weight, styleId: item.styleId });
      existingProduct.totalPrice += regularPrice;
      (existingProduct.selected = item.selected),
        (existingProduct.totalDiscountPrice += priceWithDiscount);
    } else {
      const newProduct: ProductItem = {
        id: item.id,
        name: item.name,
        totalPrice: regularPrice,
        totalDiscountPrice: priceWithDiscount,
        weights: [],
        selected: item.selected,
        licenseTypes: item.licenseTypes,
        companySize: item.companySize,
        studentDiscount: item.studentDiscount,
        wholePackageDiscount: item.wholePackageDiscount,
      };

      newProduct.weights.push({ ...item.weight, styleId: item.styleId });
      typefaceProducts.push(newProduct);
    }
  });

  return typefaceProducts;
}

export const calculatePrices = (
  prices: {
    price: number;
    discount: number | undefined;
  } = { price: 0, discount: undefined },
  purchaseDetails: PurchaseDetails | undefined
) => {
  const licenseType = purchaseDetails?.licenseTypes[0] || "desktop-print";
  const companySize = purchaseDetails?.companySize || 1;

  const multiplyRate = licenseRates[licenseType as keyof licenseRates][companySize];
  let price = prices.price;

  if (multiplyRate) {
    price = prices.price * multiplyRate;
  }

  if (purchaseDetails?.studentDiscount) {
    price = price * 0.5;
  }

  let discountPrice = prices.discount ? Math.ceil(price - price * (prices.discount / 100)) : price;

  return [roundToTwoDecimalPlaces(price), roundToTwoDecimalPlaces(discountPrice)];
};

export const calculateTotalPricesForCart = (products: Array<ProductItem>) => {
  let totalPriceCart = 0;
  let discountPriceCart = 0;

  products.forEach((product) => {
    totalPriceCart += product.totalPrice;
    discountPriceCart += product.totalDiscountPrice;
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

  return { totalPrice, discountPrice };
};

function roundToTwoDecimalPlaces(number: number) {
  if (Number.isInteger(number)) {
    return number;
  } else {
    return Math.round(number * 100) / 100;
  }
}
