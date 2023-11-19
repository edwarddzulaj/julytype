"use client";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  return (
    <Provider store={store}>
      <section className="purchase-section">
        <div className="license-options">
          <div>
            <h5>License Type</h5>
            <PurchaseOption config={licenseOptions} />
          </div>
          <div>
            <h5>Company Size</h5>
            <PurchaseOption config={companySizeOptions} />
          </div>
          <div>
            <h5>Discount</h5>
            <PurchaseOption config={discountOptions} />
          </div>
        </div>
        <div className="font-selection-options" id="font-selection-options">
          <h5>Choose weights and styles</h5>
          <FontSelection typeface={typeface} />
        </div>
      </section>
    </Provider>
  );
}
