"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";

import CartCheckout from "../components/Cart/CartCheckout/CartCheckout";

export default function CartPage() {
  return (
    <Provider store={store}>
      <section className="container page cart">
        <h3>Your cart</h3>
        <CartCheckout />
      </section>
    </Provider>
  );
}
