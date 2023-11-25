("use strict");
const STRIPE_KEY =
  process.env.STRAPI_ENV === "production"
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_TEST_SECRET_KEY;

// @ts-ignore
const stripe = require("stripe")(STRIPE_KEY);

const CLIENT_URL =
  process.env.STRAPI_ENV === "production"
    ? process.env.CLIENT_URL
    : process.env.CLIENT_TEST_URL;
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;

    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const typeface = await strapi
            .service("api::typeface.typeface")
            .findOne(product.id);

          const weightsNames = product.weights
            .map((weight) => weight.title)
            .join(", ");
          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: `JT ${product.name}`,
                description: `Your selected weights from JT ${product.name}: ${weightsNames}`,
                metadata: {
                  weights: weightsNames,
                },
              },
              unit_amount: product.totalPrice * 100,
            },
            quantity: 1,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        custom_text: {
          submit: {
            message:
              "We'll email you the font package after the payment is completed.",
          },
        },
        success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: CLIENT_URL,
      });

      await strapi.service("api::order.order").create({
        data: {
          stripeId: session.id,
          products: lineItems,
        },
      });

      return { stripeSession: session };
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));
