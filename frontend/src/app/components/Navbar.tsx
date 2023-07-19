import Link from "next/link";
import { SimplePage } from "../types/contentTypes";
import ThemeSwitcher from "./UI/ThemeSwitcher";

export default function Navbar({
  websiteDetails,
}: {
  websiteDetails: { title: string; description: string; navigationPages: { data: SimplePage[] } };
}) {
  console.log(websiteDetails);
  const { title, navigationPages } = websiteDetails;
  return (
    <nav>
      <div className="website-name">
        <Link href={`/`}>{title}</Link>
      </div>
      <ul className="pages">
        <li>
          <Link href={`/`}>Typefaces</Link>
        </li>
        {navigationPages.data.map((page: SimplePage) => (
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
    </nav>
  );
}
