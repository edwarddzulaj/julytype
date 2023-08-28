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
      allSamplesCyrillic.push(...lang.sample);
    } else {
      allSamplesLatin.push(...lang.sample);
    }
  });

  return { allSamplesLatin, allSamplesCyrillic };
}
