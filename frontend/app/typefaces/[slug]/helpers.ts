import { TypetesterTextGroup } from "@/@types/components";

export function getRandomIndex(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function indexAllSamples(languages: any) {
  const allSamplesLatin: any = [];
  const allSamplesCyrillic: any = [];

  languages.map((lang: TypetesterTextGroup) => {
    const isCyrillic = lang.language.includes("Cyrillic");
    if (isCyrillic) {
      allSamplesCyrillic.push(lang.language, ...lang.sample);
    } else {
      allSamplesLatin.push(lang.language, ...lang.sample);
    }
  });

  return { allSamplesLatin, allSamplesCyrillic };
}

export function capitalize(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
