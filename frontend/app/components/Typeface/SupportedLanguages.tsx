import { Typeface } from "@/@types/contentTypes";
import SupportedLanguagesBlock from "./SupportedLanguagesBlock";

export default function SupportedLanguages({
  languageData,
}: {
  languageData: Typeface["attributes"]["supportedLanguages"];
}) {
  return (
    <article className="supported-languages">
      {languageData.map((alphabet) => {
        return <SupportedLanguagesBlock key={alphabet.name} alphabet={alphabet} />;
      })}
    </article>
  );
}
