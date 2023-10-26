import { Style } from "@/@types/contentTypes";

export const allStylesAndWeights = (styles: Style[]) => {
  const numStyles = styles.length;
  let allWeights: string[] = [];

  styles.forEach((style) => {
    style.attributes.weights.forEach((weight) => {
      allWeights.push(`${style.attributes.title} ${weight.title}`);
    });
  });

  return { numStyles, numWeights: allWeights.length, allWeights };
};

export const pluralize = (count: number, noun: string, withDigit = true, suffix = "s") => {
  return `${withDigit ? count : ""} ${noun}${count !== 1 ? suffix : ""}`;
};
