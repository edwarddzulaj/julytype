import Link from "next/link";
import { PurchaseOption } from "../Cart/PurchaseSection/PurchaseSectionTypes";
import Iconly, { icons } from "./Iconly";

export default function InfoText({
  info,
  attributes,
}: {
  info: PurchaseOption<String>["info"];
  attributes?: any;
}) {
  return (
    <>
      {info?.url && (
        <Link href={info?.url} className="info-text link" {...attributes}>
          <Iconly icon={icons.info} />
          <p>{info.text}</p>
        </Link>
      )}
      {info?.text && !info?.url && (
        <div className="info-text" {...attributes}>
          <Iconly icon={icons.info} />
          <p>{info.text}</p>
        </div>
      )}
    </>
  );
}
