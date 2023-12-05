"use client";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

import { Typeface } from "@/@types/contentTypes";
import PurchaseSection from "./PurchaseSection";

export default function PurchaseSectionWrapper({ typeface }: { typeface: Typeface }) {
  return (
    <Provider store={store}>
      <PurchaseSection typeface={typeface} />
    </Provider>
  );
}
