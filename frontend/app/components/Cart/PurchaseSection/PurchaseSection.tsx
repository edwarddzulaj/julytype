import FontSelection from "./FontSelection";
import LicenseOptions from "./LicenseOptions/LicenseOptions";
import { Typeface } from "@/@types/contentTypes";

export default function PurchaseSection({ typeface }: { typeface: Typeface }) {
  return (
    <div>
      <LicenseOptions />
      <FontSelection typeface={typeface.attributes} />
    </div>
  );
}
