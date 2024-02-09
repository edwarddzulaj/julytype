import { TypetesterTextGroup } from "@/@types/components";

export function getRandomIndex(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function indexAllSamples(languages: any) {
  const allSamplesLatin: any = {};
  const allSamplesCyrillic: any = {};

  languages.map((lang: TypetesterTextGroup) => {
    const isCyrillic = lang.language.includes("Cyrillic");
    const langName = lang.language.split(" ")[0];

    if (isCyrillic) {
      allSamplesCyrillic[langName] = [];
      allSamplesCyrillic[langName].push(...lang.sample);
    } else {
      allSamplesLatin[langName] = [];
      allSamplesLatin[langName].push(...lang.sample);
    }
  });

  return { allSamplesLatin, allSamplesCyrillic };
}

export function capitalize(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
