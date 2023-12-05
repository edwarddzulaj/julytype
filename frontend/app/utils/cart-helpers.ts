import { TypefaceWeight } from "@/@types/components";
import { ProductItem, CartItem } from "../redux/cartReducer";

export function formatData(items: Array<CartItem>) {
  let typefaceProducts: Array<ProductItem> = [];

  items.forEach((item) => {
    const existingProduct = typefaceProducts.find((p) => p.id === item.id);

    if (existingProduct) {
      existingProduct.weights.push({ ...item.weight, styleId: item.styleId });
      existingProduct.totalPrice += calculateFinalPrice(item.weight);
    } else {
      const newProduct: ProductItem = {
        id: item.id,
        name: item.name,
        totalPrice: calculateFinalPrice(item.weight),
        weights: [],
        licenseTypes: item.licenseTypes,
        companySize: item.companySize,
        discount: item.discount,
        wholePackage: item.wholePackage,
      };

      newProduct.weights.push({ ...item.weight, styleId: item.styleId });
      typefaceProducts.push(newProduct);
    }
  });

  return typefaceProducts;
}

export const calculateFinalPrice = (weight: TypefaceWeight) => {
  return weight.discount
    ? Math.ceil(weight.price - weight.price * (weight.discount / 100))
    : weight.price;
};

export const calculateTotalPricesForCart = (products: Array<ProductItem>) => {
  let totalPriceCart = 0;
  let discountPriceCart = 0;
  products.forEach((product) => {
    const { totalPrice, discountPrice } = calculateTotalPrices(product.weights);
    totalPriceCart += totalPrice;
    discountPriceCart += discountPrice;
  });

  return { totalPriceCart, discountPriceCart };
};

export const calculateTotalPrices = (weights: TypefaceWeight[]) => {
  let totalPrice = 0;
  let discountPrice = 0;
  weights.forEach((weight) => {
    totalPrice += weight.price;
    discountPrice += calculateFinalPrice(weight);
  });

  return { totalPrice, discountPrice };
};
