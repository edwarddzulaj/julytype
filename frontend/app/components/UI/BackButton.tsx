import Link from "next/link";
import Iconly, { icons } from "./Iconly";

export default function BackButton({
  backLink = "/",
  children,
}: {
  backLink?: string;
  children?: any;
}) {
  const content = children || "Back";

  return (
    <Link href={backLink}>
      <Iconly icon={icons.arrowLeft} /> {content}
    </Link>
  );
}
