import FontSelection from "./FontSelection";
import { Typeface } from "@/@types/contentTypes";
import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {

  return (
    <section className="purchase-section">
      <div className="license-options">
        <div>
          <h4>License Type</h4>
          <PurchaseOption config={licenseOptions} />
        </div>
        <div>
          <h4>Company Size</h4>
          <PurchaseOption config={companySizeOptions} />
        </div>
        <div>
          <h4>Discount</h4>
          <PurchaseOption config={discountOptions} />
        </div>
      </div>
      <div className="font-selection-options">
        <h4>Choose weights and styles</h4>
        <FontSelection typeface={typeface.attributes} />
      </div>
    </section>
  );
}
