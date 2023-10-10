import { retrieveTrialFonts } from "@/app/components/SimplePage/DownloadTrialFonts/helpers";

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
