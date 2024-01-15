"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "../../../redux/hooks";

import Link from "next/link";
import { ProductItem, emptyCart } from "@/app/redux/cartReducer";
import ProductItemContainer from "./ProductItemContainer";
import { useEffect, useState } from "react";
import { calculateTotalPricesForCart, formatData } from "@/app/utils/cart-helpers";

export default function CartCheckout() {
  const cart = useAppSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState<Array<ProductItem>>([]);
  const [finalCartItems, setFinalCartItems] = useState<Array<ProductItem>>([]);
  const [prices, setPrices] = useState({ price: 0, finalPrice: 0 });
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const items = formatData(cart.products);
    setCartItems(items), [cart.products];

    const finalCartItems = items.filter((i) => i.selected === true);
    setFinalCartItems(finalCartItems);

    const { totalPriceCart, discountPriceCart } = calculateTotalPricesForCart(finalCartItems);
    setPrices({ price: totalPriceCart, finalPrice: discountPriceCart });
  }, [cart.products]);

  emptyCart();
  const redirectToCheckout = async () => {
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY as string
      );
      if (!stripe) throw new Error("Stripe failed to initialize.");
      setIsRedirecting(true);

      const checkoutResponse = await fetch("/cart/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: finalCartItems }),
      });

      const { sessionId } = await checkoutResponse.json();
      const stripeError = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        setIsRedirecting(false);
        console.error(stripeError);
      }
    } catch (error) {
      setIsRedirecting(false);
      console.error(error);
    }
  };

  return (
    <section className="cart">
      <div className="cart-header">
        <div>No.</div>
        <div>Item</div>
        <div>Price</div>
      </div>
      <div className="cart-items">
        {cartItems.length > 0 &&
          cartItems.map((item, index) => (
            <ProductItemContainer key={item.id} item={item} index={index} />
          ))}
        {cartItems.length === 0 && (
          <div className="no-cart-items">
            <h5>You have no items in your cart yet</h5>
          </div>
        )}
      </div>
      <div className="cart-footer">
        {cartItems.length > 0 && (
          <div className="total-price">
            <div>Subtotal:</div>
            <div>
              {prices.price !== prices.finalPrice && (
                <>
                  <span className="price">{prices.price} EUR</span>&nbsp;
                </>
              )}
              <span className="discount-price">{prices.finalPrice} EUR</span>
            </div>
          </div>
        )}
        <div className="actions">
          {cartItems.length < 1 && (
            <Link href="/" className="browse-more">
              Browse more typefaces
            </Link>
          )}
          {cartItems.length > 0 && (
            <div className="payment" onClick={redirectToCheckout}>
              {isRedirecting ? "Redirecting..." : "Proceed to payment"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
