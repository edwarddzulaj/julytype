import Link from "next/link";
import { SimplePage } from "../../@types/contentTypes";
import ThemeSwitcher from "./UI/ThemeSwitcher";
import Iconly, { icons } from "./UI/Iconly";

export default function Navbar({
  websiteDetails,
}: {
  websiteDetails: { title: string; description: string; navPages: { data: SimplePage[] } };
}) {
  const { title, navPages } = websiteDetails;
  return (
    <nav>
      <div className="website-name">
        <Link href={`/`}>{title}</Link>
      </div>
      <div className="mobile-nav">
        <span className="close">
          Close <Iconly icon={icons.close} />
        </span>
        <div className="inner-nav">
          <ul className="pages">
            <li>
              <Link href={`/`}>Typefaces</Link>
            </li>
            {navPages.data.map((page: SimplePage) => (
              <li key={page.id}>
                <Link href={`/${page.attributes.slug}`}>{page.attributes.title}</Link>
              </li>
            ))}
          </ul>
          <div className="settings">
            <div className="theme-switcher">
              <ThemeSwitcher />
            </div>
            <div className="cart">
              <Link href={`/cart`}>Cart</Link>
            </div>
          </div>
        </div>
      </div>
      <Iconly icon={icons.hamburger} />
    </nav>
  );
}
