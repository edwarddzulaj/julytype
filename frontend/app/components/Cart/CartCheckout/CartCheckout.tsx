"use client";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import Link from "next/link";
import { CartItem, ProductItem } from "@/app/redux/cartReducer";
import ProductItemContainer from "./ProductItemContainer";
import { TypefaceWeight } from "@/@types/components";
import { useEffect, useState } from "react";

export default function CartCheckout() {
  const cart = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const [cartItems, setCartItems] = useState<Array<ProductItem>>([]);

  useEffect(() => {
    const items = splitIntoTypefaces(cart.products);
    setCartItems(items), [cart.products];
  }, [cart.products]);

  return (
    <div className="cart-items">
      {cartItems.length > 0 &&
        cartItems.map((item) => <ProductItemContainer key={item.id} item={item} />)}
      {cartItems.length === 0 && (
        <div className="no-cart-items">
          <h5>You have no items in your cart yet</h5>
          <Link href="/" className="browse-more">
            Browse more typefaces
          </Link>
        </div>
      )}
    </div>
  );
}

function splitIntoTypefaces(products: Array<CartItem>) {
  let typefaceProducts: Array<ProductItem> = [];

  products.forEach((product) => {
    const existingProduct = typefaceProducts.find((p) => p.id === product.id);

    if (existingProduct) {
      existingProduct.weights.push(product.weight);
    } else {
      const newProduct = {
        id: product.id,
        name: product.name,
        weights: [] as TypefaceWeight[],
        licenseType: product.licenseType,
        companySize: product.companySize,
        discount: product.discount,
        wholePackage: product.wholePackage,
      };

      newProduct.weights.push(product.weight);
      typefaceProducts.push(newProduct);
    }
  });

  return typefaceProducts;
}
