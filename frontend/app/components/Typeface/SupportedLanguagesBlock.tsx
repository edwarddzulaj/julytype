"use client";
import { useState } from "react";
import { Alphabet } from "@/@types/contentTypes";
import { capitalize } from "@/app/typefaces/[slug]/helpers";
import ShowAllButton from "../UI/ShowAllButton";

export default function SupportedLanguagesBlock({ alphabet }: { alphabet: Alphabet }) {
  const { name, languages } = alphabet;
  const mappedLanguages = languages.split(", ");
  const shouldCollapse = mappedLanguages.length > 28; //some arbitrary value for how many languages will trigger a collapse

  const [isCollapsed, setIsCollapsed] = useState(shouldCollapse);

  return (
    <article key={name}>
      <h6>{capitalize(name)}</h6>
      <article className={`languages ${isCollapsed ? "collapsed" : ""}`}>
        {mappedLanguages.map((language) => (
          <div key={language}>{language}</div>
        ))}
      </article>
      {shouldCollapse && (
        <ShowAllButton isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
    </article>
  );
}
