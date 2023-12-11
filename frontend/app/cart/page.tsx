"use client";
import { fetchAPI } from "@/app/utils/fetch-api";

import { Provider } from "react-redux";
import { store } from "../redux/store";

import CartCheckout from "../components/Cart/CartCheckout/CartCheckout";

async function getCartItems() {
  //   const path = `/simple-pages`;
  //   const urlParamsObject = {
  //     populate: "*",
  //     filters: {
  //       slug: slug,
  //     },
  //   };
  //   const responseData = await fetchAPI(path, urlParamsObject);
  //   return responseData.data[0];
}

export default function CartPage() {
  return (
    <Provider store={store}>
      <section className="container page cart">
        <h3>Your cart</h3>
        <hr />
        <CartCheckout />
      </section>
    </Provider>
  );
}
