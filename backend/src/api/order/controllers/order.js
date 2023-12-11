("use strict");

const isProduction = process.env.STRAPI_ENV === "production";
const CLIENT_URL = isProduction
  ? process.env.CLIENT_URL
  : process.env.CLIENT_TEST_URL;

const STRIPE_KEY = isProduction
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

// @ts-ignore
const stripe = require("stripe")(STRIPE_KEY);

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
          const weightsNames = product.weights
            .map((weight) => weight.title)
            .join(", ");

          let weightsData = await Promise.all(
            product.weights.map(async (weight) => {
              const styleEntity = await strapi.entityService.findMany(
                "api::style.style",
                {
                  filters: {
                    id: weight.styleId,
                  },
                  populate: {
                    weights: true,
                  },
                }
              );

              const chosenWeight = {
                styleId: weight.styleId,
                id: weight.id,
                title: weight.title,
                confirmedPrice: styleEntity[0].weights.some((styleWeight) => {
                  return (
                    styleWeight.id === weight.id &&
                    styleWeight.price === weight.price &&
                    styleWeight.discount === weight.discount
                  );
                }),
              };

              return chosenWeight;
            })
          );

          if (!weightsData.every((w) => w.confirmedPrice)) return;

          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: `JT ${product.name}`,
                description: `Your selected weights from JT ${product.name}: ${weightsNames}`,
                metadata: {
                  weights: JSON.stringify(weightsData),
                },
                images: [
                  `${process.env.STRAPI_URL}/assets/images/order-globus.jpeg`,
                ],
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
          status: "pending",
        },
      });

      return { stripeSession: session };
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
  async finishOrder(ctx) {
    const { sessionId, name, email } = ctx.request.body;

    try {
      const orders = await strapi.entityService.findMany("api::order.order", {
        filters: {
          stripeId: sessionId,
        },
      });
      const order = orders[0];

      if (!order.email && email) {
        await strapi.entityService.update("api::order.order", order.id, {
          data: {
            email: email,
            status: "paid",
          },
        });

        try {
          await strapi
            .service("api::order.order")
            .sendTypefacesToEmail(name, email, order.products);

          await strapi.entityService.update("api::order.order", order.id, {
            data: {
              status: "completed",
            },
          });
        } catch {
          console.error("Could not send an email to this user: " + email);
        }
      }
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));
