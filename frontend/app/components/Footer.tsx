"use client";
import Link from "next/link";
import { SocialMediaLink } from "../../@types/components";
import { SimplePage } from "../../@types/contentTypes";

export default function Footer({
  footerContent,
}: {
  footerContent: {
    copyright: string | null;
    socialMediaLinks: SocialMediaLink[];
    footerPages: { data: SimplePage[] };
  };
}) {
  const { copyright, socialMediaLinks, footerPages } = footerContent;

  return (
    <footer>
      <section className="social-media">
        {socialMediaLinks.map((link) => (
          <Link href={link.url} key={link.id}>
            {link.name}
          </Link>
        ))}
      </section>
      <section className="pages">
        {footerPages.data.map((page: SimplePage) => (
          <Link href={`/${page.attributes.slug}`} key={page.id}>
            {page.attributes.title}
          </Link>
        ))}
        <div className="copyright">{copyright}</div>
      </section>
    </footer>
  );
}
