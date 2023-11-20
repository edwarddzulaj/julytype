import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import stripe from "@/app/config/stripe";
import { ProductItem } from "@/app/redux/cartReducer";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const { cartItems } = await req.json();

  const lineItems = cartItems.map((item: ProductItem) => {
    const weightsNames = item.weights.map((weight) => weight.title).join(", ");

    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: `JT ${item.name}`,
          description: `Your selected weights from JT ${item.name}: ${weightsNames}`,
          metadata: {
            weights: weightsNames,
          },
        },
        unit_amount: item.totalPrice! * 100,
      },
      quantity: 1,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      custom_text: {
        submit: {
          message: "We'll email you the font package after the payment is completed.",
        },
      },
      success_url: `${headersList.get("origin")}/success`,
      cancel_url: `${headersList.get("origin")}/`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}
