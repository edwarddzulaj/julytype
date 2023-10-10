import { fetchAPI } from "@/app/utils/fetch-api";
import { Typeface } from "@/@types/contentTypes";
const BASE_URL = "http://localhost:1337";

export async function GET(request: Request, res: Response) {
  let response: any;
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (endpoint === "trialFonts") {
    const trialFonts = await retrieveTrialFonts();
    return new Response(JSON.stringify(trialFonts));
  }
  return response;
}

const retrieveTrialFonts = async () => {
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
    let trialFontObject: { name: string; trialFonts: any[] } = {
      name: title + " Trial",
      trialFonts: [],
    };

    if (!trialFonts.data || trialFonts.data.length === 0) return;

    trialFontObject.trialFonts = trialFonts.data;
    trialFontsArray.push(trialFontObject);
  });

  return trialFontsArray;
};
