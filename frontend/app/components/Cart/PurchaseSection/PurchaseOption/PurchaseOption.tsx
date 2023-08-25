import Link from "next/link";
import { PurchaseOption } from "../PurchaseSectionTypes";
import Iconly, { icons } from "@/app/components/UI/Iconly";

export default function PurchaseOption({ config }: { config: PurchaseOption }) {
  const { title, subtitle, options, info } = config;

  return (
    <article className="purchase-option">
      <h5>{title}</h5>
      <div>
        <h6>{subtitle}</h6>
        <div className="options"></div>
        {info && (
          <Link href={info.url}>
            <Iconly icon={icons.info} />
            {info.text}
          </Link>
        )}
      </div>
    </article>
  );
}
