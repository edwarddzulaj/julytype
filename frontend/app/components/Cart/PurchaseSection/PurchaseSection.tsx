"use client";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";
import { useState } from "react";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  const [purchaseDetails, setPurchaseDetails] = useState<{
    licenseType: string | null;
    companySize: number | null;
    discount: boolean | null;
  }>({
    licenseType: null,
    companySize: null,
    discount: null,
  });

  return (
    <Provider store={store}>
      <section className="purchase-section">
        <div className="license-options">
          <div>
            <h5>License Type</h5>
            <PurchaseOption
              config={licenseOptions}
              setCallback={(optionValue: string) => {
                setPurchaseDetails({ ...purchaseDetails, licenseType: optionValue });
              }}
            />
          </div>
          <div>
            <h5>Company Size</h5>
            <PurchaseOption
              config={companySizeOptions}
              setCallback={(optionValue: string) => {
                setPurchaseDetails({ ...purchaseDetails, companySize: +optionValue });
              }}
            />
          </div>
          <div>
            <h5>Discount</h5>
            <PurchaseOption
              config={discountOptions}
              setCallback={(optionValue: string) => {
                setPurchaseDetails({
                  ...purchaseDetails,
                  discount: optionValue === "yes" ? true : false,
                });
              }}
            />
          </div>
        </div>
        <div className="font-selection-options">
          <h5>Choose weights and styles</h5>
          <FontSelection typeface={typeface} />
        </div>
      </section>
    </Provider>
  );
}
