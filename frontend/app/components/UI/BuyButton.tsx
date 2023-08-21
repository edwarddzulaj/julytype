import Link from "next/link";

export default function BuyButton({ children }: { children?: any }) {
  const content = children || "Buy";

  return (
    <Link href="">
      <button className="buy-button">{content}</button>
    </Link>
  );
}
