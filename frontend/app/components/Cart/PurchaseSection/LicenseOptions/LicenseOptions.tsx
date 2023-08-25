import PurchaseOption from "./PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";

export default function LicenseOptions() {
  return (
    <section className="license-options">
      <PurchaseOption config={licenseOptions} />
      <PurchaseOption config={companySizeOptions} />
      <PurchaseOption config={discountOptions} />
    </section>
  );
}
