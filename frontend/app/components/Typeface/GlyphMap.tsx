"use client";

import { Typeface } from "@/@types/contentTypes";
import { useState } from "react";
import GlyphMapRow from "./GlyphMapRow";
import ShowAllButton from "../UI/ShowAllButton";

export default function GlyphMap({
  glyphMap,
  fontFamilyTitle,
  showAllButton,
}: {
  glyphMap: Typeface["attributes"]["glyphMap"];
  fontFamilyTitle?: string;
  showAllButton?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <div className="glyph-map" style={{ fontFamily: `${fontFamilyTitle}, Adobe Blank` }}>
        <div className={`glyph-map-rows ${isCollapsed ? "collapsed" : ""}`}>
          {glyphMap.map((glyphMapRow) => (
            <GlyphMapRow key={glyphMapRow.id} glyphMapRow={glyphMapRow} />
          ))}
        </div>
        {showAllButton && (
          <ShowAllButton isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
      </div>
    </>
  );
}
