"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Footer({
  footerContent,
}: {
  footerContent: {
    copyright: string | null;
  };
}) {
  console.log(footerContent);
  return <footer>{footerContent.copyright}</footer>;
}
