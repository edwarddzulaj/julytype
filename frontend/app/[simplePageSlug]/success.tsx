import Link from "next/link";
import Image from "next/image";
import { fetchAPI } from "../utils/fetch-api";
import { getStrapiMedia } from "../utils/api-helpers";
import CartStateWrapper from "../components/Cart/CartCheckout/CartStateWrapper";

const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY as string);

export default async function SuccessPage({ sessionId }: { sessionId: string | undefined }) {
  const customerDetails = await getCustomerDetails(stripe);
  const [customerName, customerEmail] = customerDetails;

  async function getCustomerDetails(stripe: any) {
    let customerName = "";
    let customerEmail = "";

    try {
      if (stripe && sessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const { customer_details } = session;

        customerName = customer_details.name;
        customerEmail = customer_details.email;

        finishOrder(customerName, customerEmail);
      } else {
        if (!stripe) throw new Error("Stripe failed to initialize.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      return [customerName, customerEmail];
    }
  }

  async function finishOrder(customerName: string, customerEmail: string) {
    await fetchAPI(
      "/order/finish_order",
      {},
      {
        method: "POST",
        body: JSON.stringify({ sessionId: sessionId, name: customerName, email: customerEmail }),
      }
    );
  }

  return (
    <section className="container page success">
      <CartStateWrapper />
      <h2>Thank you for your purchase!</h2>
      <h5>You will receive an email shortly.</h5>
      <Image
        className="globus-image"
        src={getStrapiMedia("/assets/images/success-globus.svg") as string}
        width={360}
        height={400}
        alt="Success globus"
      ></Image>
      <Link className="back-home" href="/">
        Back home
      </Link>
    </section>
  );
}
