import PurchaseOption from "./PurchaseOption/PurchaseOption";
import { companySizeOptions, discountOptions, licenseOptions } from "./purchase-option-configs";

export default function LicenseOptions() {
  return (
    <section>
      <PurchaseOption config={licenseOptions} />
      <PurchaseOption config={companySizeOptions} />
      <PurchaseOption config={discountOptions} />
    </section>
  );
}
