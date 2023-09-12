import { capitalize } from "@/app/typefaces/[slug]/helpers";

export default function SupportedLanguages() {
  const languageMap = {
    cyrillic: ["Russian", "Ukrainian", "Bulgarian"],
    latin: ["English", "German", "Dutch"],
  };
  return (
    <article className="supported-languages">
      {Object.entries(languageMap).map((alphabet) => {
        const name = alphabet[0];
        const languages = alphabet[1];

        return (
          <article key={name}>
            <h6>{capitalize(name)}</h6>
            <article className="languages">
              {languages.map((language) => (
                <div key={language}>{language}</div>
              ))}
            </article>
          </article>
        );
      })}
    </article>
  );
}
