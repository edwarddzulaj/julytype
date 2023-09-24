"use client";
import { useEffect } from "react";

export default function TypefaceSample({ title, fontURL }: any) {
  useEffect(() => {
    const newFont = new FontFace(title, `url(${fontURL})`);
    newFont
      .load()
      .then(function (loaded_face) {
        document.fonts.add(loaded_face);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [title, fontURL]);

  return <h2 style={{ fontFamily: `${title}, \"Adobe Blank\"` }}>{title}</h2>;
}
