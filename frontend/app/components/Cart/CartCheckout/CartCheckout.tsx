"use client";
import { loadStripe } from "@stripe/stripe-js";
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
    const items = formatData(cart.products);
    setCartItems(items), [cart.products];
  }, [cart.products]);

  const redirectToCheckout = async () => {
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY as string
      );

      if (!stripe) throw new Error("Stripe failed to initialize.");

      const checkoutResponse = await fetch("/cart/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems }),
      });

      const { sessionId } = await checkoutResponse.json();
      const stripeError = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        console.error(stripeError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="cart-items">
        {cartItems.length > 0 &&
          cartItems.map((item) => <ProductItemContainer key={item.id} item={item} />)}
        {cartItems.length === 0 && (
          <div className="no-cart-items">
            <h5>You have no items in your cart yet</h5>
          </div>
        )}
      </div>
      <div className="actions">
        <Link href="/" className="browse-more">
          Browse more typefaces
        </Link>
        <div className="payment" onClick={() => cart.products.length > 0 && redirectToCheckout()}>
          Proceed to payment
        </div>
      </div>
    </>
  );
}

function formatData(items: Array<CartItem>) {
  let typefaceProducts: Array<ProductItem> = [];

  items.forEach((item) => {
    const existingProduct = typefaceProducts.find((p) => p.id === item.id);

    if (existingProduct) {
      existingProduct.weights.push(item.weight);
      existingProduct.totalPrice += calculateFinalPrice(item.weight);
    } else {
      const newProduct = {
        id: item.id,
        name: item.name,
        totalPrice: calculateFinalPrice(item.weight),
        weights: [] as TypefaceWeight[],
        licenseType: item.licenseType,
        companySize: item.companySize,
        discount: item.discount,
        wholePackage: item.wholePackage,
      };

      newProduct.weights.push(item.weight);
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
