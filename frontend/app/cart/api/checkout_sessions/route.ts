import { NextResponse, NextRequest } from "next/server";
import { fetchAPI } from "@/app/utils/fetch-api";

export async function POST(req: NextRequest, res: NextResponse) {
  const { cartItems } = await req.json();

  try {
    const response = await fetchAPI(
      "/orders",
      {},
      { method: "POST", body: JSON.stringify({ cartItems }) }
    );

    return NextResponse.json({ sessionId: response?.stripeSession?.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}
