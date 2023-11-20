import Stripe from "stripe";

const STRIPE_KEY =
process.env.NEXT_PUBLIC_STRAPI_ENV === "production"
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

if (!STRIPE_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing. Please set the environment variable.');
}

const stripe = new Stripe(STRIPE_KEY!, {
    apiVersion: "2023-10-16",
  });
  
export default stripe;