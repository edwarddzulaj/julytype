import Section from "./components/UI/Section";
import { fetchAPI } from "./utils/fetch-api";

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
    <section className="container page">
      {customerName && <h2>Thank you, {customerName.split(" ")[0]}!</h2>}
      {!customerName && <h2>Thank you!</h2>}
      <section className="sections">
        <Section>
          <h5>
            Your payment is successful!
            <br />
            We will send your typeface package to your email &nbsp;
            <i>{customerEmail}</i> in the next couple of minutes.
          </h5>
        </Section>
      </section>
    </section>
  );
}
