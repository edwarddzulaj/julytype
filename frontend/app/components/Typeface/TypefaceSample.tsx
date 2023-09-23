"use client";

import { useEffect, useRef } from "react";

export default function TypefaceSample({ title, fontURL }: any) {
  const sampleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sampleRef) {
      const newFont = new FontFace(title, `url(${fontURL})`);
      newFont
        .load()
        .then(function (loaded_face) {
          document.fonts.add(loaded_face);
          sampleRef.current!.style.fontFamily = title;
        })
        .catch(function (error) {
          // error occurred
        });
    }
  }, [sampleRef, title, fontURL]);

  return <h2 ref={sampleRef}>{title}</h2>;
}
