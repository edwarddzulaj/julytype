import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";

export interface TrialFontObject {
  name: string;
  id: number;
  trialFonts: any[];
  checked: boolean;
}

export const retrieveTrialFonts = async () => {
  const path = `/typefaces`;
  const urlParamsObject = {
    populate: {
      trialFonts: { populate: "*" },
    },
  };

  const responseData = await fetchAPI(path, urlParamsObject);

  let trialFontsArray: any[] = [];

  responseData.data.forEach((typeface: Typeface) => {
    const { title, trialFonts } = typeface.attributes;
    let trialFontObject: TrialFontObject = {
      id: typeface.id,
      name: title + " Trial",
      trialFonts: [],
      checked: false,
    };

    if (!trialFonts.data || trialFonts.data.length === 0) return;

    trialFontObject.trialFonts = trialFonts.data;
    trialFontsArray.push(trialFontObject);
  });

  return trialFontsArray;
};
