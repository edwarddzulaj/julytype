"use client";

import { Typeface } from "@/@types/contentTypes";
import { useState } from "react";

export default function GlyphMap({
  glyphMap,
  fontFamilyTitle,
  showAllButton,
}: {
  glyphMap: Typeface["attributes"]["glyphMap"];
  fontFamilyTitle?: string;
  showAllButton?: boolean;
}) {
  return (
    <div className="glyph-map" style={{ fontFamily: `${fontFamilyTitle}, Adobe Blank` }}>
      <>
        {glyphMap.map((glyphMapRow) => (
          <article key={glyphMapRow.id} className="glyph-map-row">
            <h5 className="glyph-map-row-header">{glyphMapRow.title}</h5>
            <p className="glyph-map-row-content">{glyphMapRow.content}</p>
          </article>
        ))}
      </>
    </div>
  );
}
