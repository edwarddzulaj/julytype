import { Typeface } from "@/@types/contentTypes";
import { capitalize } from "@/app/typefaces/[slug]/helpers";

export default function SupportedLanguages({
  languageData,
}: {
  languageData: Typeface["attributes"]["supportedLanguages"];
}) {
  return (
    <article className="supported-languages">
      {languageData.map((alphabet) => {
        const { name, languages } = alphabet;
        const mappedLanguages = languages.split(", ");

        return (
          <article key={name}>
            <h6>{capitalize(name)}</h6>
            <article className="languages">
              {mappedLanguages.map((language) => (
                <div key={language}>{language}</div>
              ))}
            </article>
          </article>
        );
      })}
    </article>
  );
}
