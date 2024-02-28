"use client";

import { useEffect, useRef, useState } from "react";
import Iconly, { icons } from "./Iconly";

interface dropdownMenuItems {
  value: string;
  label: string;
  checked?: Boolean;
}

export default function CheckboxDropdown({
  title = "Features",
  dropdownItems = [],
  handleOnChange,
}: {
  title?: string;
  dropdownItems: dropdownMenuItems[];
  handleOnChange: any;
}) {
  const [open, isOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        isOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    isOpen(!open);
  };
  return (
    <>
      <div className={`checkbox-dropdown ${open ? "open" : ""}`} ref={dropdownRef}>
        <label className="title" onClick={toggleMenu}>
          {title}
          <span className="dropdown-control">
            {!open && <Iconly icon={icons.chevronDown} />}
            {open && <Iconly icon={icons.chevronUp} />}
          </span>
        </label>

        {open && (
          <ul className="dropdown-menu">
            {dropdownItems.map((item) => (
              <li key={item.value}>
                <input
                  type="checkbox"
                  checked={item.checked as boolean}
                  id={item.value}
                  onChange={handleOnChange}
                />
                <label htmlFor={item.value}> {item.label}</label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
