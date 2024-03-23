"use client";

import Link from "next/link";
import { SimplePage } from "../../@types/contentTypes";
import ThemeSwitcher from "./UI/ThemeSwitcher";
import Iconly, { icons } from "./UI/Iconly";
import { useState } from "react";

export default function Navbar({
  websiteDetails,
}: {
  websiteDetails: { title: string; description: string; navPages: { data: SimplePage[] } };
}) {
  const { title, navPages } = websiteDetails;
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const closeMenu = () => {
    setIsMenuActive(false);
  };
  return (
    <nav>
      <div className="website-name">
        <Link href={`/`}>{title}</Link>
      </div>
      <div className={`inner-nav ${isMenuActive ? "active" : ""}`}>
        <ul className="pages">
          <li onClick={closeMenu}>
            <Link href={`/`}>Typefaces</Link>
          </li>
          {navPages.data.map((page: SimplePage) => (
            <li key={page.id} onClick={closeMenu}>
              <Link href={`/${page.attributes.slug}`}>{page.attributes.title}</Link>
            </li>
          ))}
        </ul>
        <div className="settings">
          <div className="inner-settings">
            <div className="theme-switcher">
              <ThemeSwitcher />
            </div>
            <div className="cart">
              <Link href={`/cart`}>
                Cart <Iconly icon={icons.basket}></Iconly>
              </Link>
            </div>
          </div>
          <button className="close" onClick={closeMenu}>
            Close <Iconly icon={icons.close} />
          </button>
        </div>
      </div>
      <div className="mobile-nav">
        <button onClick={toggleMenu}>
          <Iconly icon={icons.hamburger} />
        </button>
      </div>
    </nav>
  );
}
