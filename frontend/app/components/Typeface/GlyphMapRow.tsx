"use client";
import { useMemo } from "react";
import { GlyphMapRow } from "@/@types/contentTypes";

export default function GlyphMapRow({ glyphMapRow }: { glyphMapRow: GlyphMapRow }) {
  const feature: { type: string; value: string } | undefined = remapOpentypeFeature(
    glyphMapRow?.opentypeFeature
  );

  const styleOptions = useMemo(() => {
    if (feature && feature.type === "opentype") {
      return {
        fontFeatureSettings: ` "${feature.value}"`,
      };
    }
  }, [feature]);

  return (
    <article className="glyph-map-row">
      <h5 className="glyph-map-row-header">{glyphMapRow.title}</h5>
      <p
        className="glyph-map-row-content"
        lang={`${feature?.type === "language" ? feature.value : ""}`}
        style={styleOptions}
      >
        {glyphMapRow.content}
      </p>
    </article>
  );
}

const remapOpentypeFeature = (feature: string | undefined) => {
  if (!feature) return;

  const featureArray = feature.split(": ");
  const featureType = featureArray[0];
  const featureValue = featureArray[1].split(",")[0];

  return {
    type: featureType,
    value: featureValue,
  };
};
