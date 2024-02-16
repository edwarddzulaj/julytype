"use client";

import { Typeface } from "@/@types/contentTypes";
import { useState } from "react";
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
            <article key={glyphMapRow.id} className="glyph-map-row">
              <h5 className="glyph-map-row-header">{glyphMapRow.title}</h5>
              <p className="glyph-map-row-content">{glyphMapRow.content}</p>
            </article>
          ))}
        </div>
        {showAllButton && (
          <ShowAllButton isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
      </div>
    </>
  );
}
