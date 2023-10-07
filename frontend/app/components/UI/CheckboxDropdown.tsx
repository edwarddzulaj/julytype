"use client";

import { useState } from "react";
import Iconly, { icons } from "./Iconly";

interface dropdownMenuItems {
  value: string;
  label: string;
  checked?: Boolean;
}

export default function CheckboxDropdown({
  dropdownItems = [],
  handleOnChange,
}: {
  dropdownItems: dropdownMenuItems[];
  handleOnChange: any;
}) {
  const [open, isOpen] = useState(false);

  const toggleMenu = () => {
    isOpen(!open);
  };
  return (
    <>
      <div className={`checkbox-dropdown ${open ? "open" : ""}`}>
        <label className="title" onClick={toggleMenu}>
          Features
          <span>
            {!open && <Iconly icon={icons.chevronUp} />}
            {open && <Iconly icon={icons.chevronDown} />}
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
