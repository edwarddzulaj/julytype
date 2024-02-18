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
const { NodeDiskStorage } = require('node-disk-storage');
const swot = require("swot-node");

const nds = new NodeDiskStorage();

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { cartItems: products } = ctx.request.body;

    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const typefaceEntity = await strapi.entityService.findOne(
            "api::typeface.typeface", product.typefaceId,
            {
              fields: ['price', 'wholePackageDiscount'],
              populate: {
                variableFont: true,
              },
            }
          );

          const weightsNames = product.weights
            .map((weight) => weight.title)
            .join(", ");

          // Compare the price of each weight from the cart with the database and confirm it
          let weightsData = await Promise.all(
            product.weights.map(async (weight) => {

              let chosenWeight = {
                typefaceId: product.typefaceId,
                styleId: weight.styleId || null,
                id: weight.id,
                title: weight.title,
                isVariableFont: false,
                confirmedPrice: false
              };

              if (weight.styleId) {
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

                chosenWeight.confirmedPrice = styleEntity[0].weights.some((styleWeight) => {
                  return (
                    styleWeight.id === weight.id &&
                    styleWeight.price === weight.price &&
                    styleWeight.discount === weight.discount
                  );
                });
              } else if (weight.isVariableFont) {
                const variableFont = typefaceEntity.variableFont;

                chosenWeight.isVariableFont = true;
                chosenWeight.confirmedPrice = variableFont.id === weight.id &&
                  variableFont.price === weight.price &&
                  variableFont.discount === weight.discount
              }

              return chosenWeight;
            })
          );

          const isWholePackageConfirmed = product.purchaseDetails.wholePackageDiscount ? product.totalPrice === typefaceEntity.price : true;
          if (!weightsData.every((w) => w.confirmedPrice) || !isWholePackageConfirmed) return;

          const formattedWeightsData = weightsData.reduce((prev, curr) => ({ ...prev, ['Weight: ' + curr.title]: JSON.stringify(curr) }), {})
          const formattedMetadata = {
            licenses: JSON.stringify(product.purchaseDetails),
            ...formattedWeightsData
          }

          return {
            price_data: {
              currency: "eur",
              product_data: {
                name: `JT ${product.name}`,
                description: `Your selected weights from JT ${product.name}: ${weightsNames}`,
                metadata: formattedMetadata,
                images: [
                  `${process.env.STRAPI_URL}/assets/images/order-globus.jpeg`,
                ],
              },
              unit_amount: product.totalDiscountPrice * 100,
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
      console.error(error);
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
          console.error("Could not send an email to this customer: " + email);
        }
      }
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
  async sendVerificationCode(ctx) {
    const { studentEmail } = ctx.request.body;

    try {
      // const isValidStudentEmail = await swot.isAcademic(studentEmail);
      const isValidStudentEmail = true;
      const randomCode = Math.floor(Math.random() * 1000) + 1

      if (isValidStudentEmail) {
        await strapi
          .service("api::order.order")
          .sendVerificationCode(studentEmail, randomCode);
        console.log(randomCode);
        await nds.set(`code: ${studentEmail}`, randomCode)
      } else {
        ctx.response.status = 406;
        return ctx.response;
      }

      ctx.response.status = 200;
      return ctx.response;
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
  async verifyStudentEmail(ctx) {
    const { studentEmail, code } = ctx.request.body;
    const storageKey = `code: ${studentEmail}`;
    try {
      const storedCode = await nds.get(storageKey);

      if (storedCode == code) {
        await nds.remove(storageKey);
        ctx.response.status = 200;
        return ctx.response;
      } else {
        ctx.response.status = 406;
        return ctx.response;
      }
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));
