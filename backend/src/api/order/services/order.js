"use strict";

const nodemailer = require("nodemailer");
const OrderEmail = require("./OrderEmail.js");

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ }) => ({
  /**
   * @param {string} name - Customer name
   * @param {string} email - Customer email
   * @param {any} products - Purchased products to include in the zip package
   */
  async sendTypefacesToEmail(name, email, products) {
    const orderEmail = new OrderEmail(products);
    const fontURLs = await orderEmail.retrieveFontURLs();
    let zip = await orderEmail.zipFonts(fontURLs);
    zip = await orderEmail.zipExtraFiles(zip);

    orderEmail.send(zip, name, email);
  },
  /**
   * @param {string} email - Customer email
   * @param {string} code - Verification code
   */
  async sendVerificationCode(email, code) {
    const TEXT_MESSAGE = `Hello there, you are receiving this code <h1>${code}</h1> to 
    verify your student email on www.julytype.com`;

    const message = {
      from: process.env.ORDERS_EMAIL_ADDRESS,
      to: email,
      subject: "JulyType Student email verification",
      text: TEXT_MESSAGE,
      html: `<p>${TEXT_MESSAGE}</p>`,
    };

    let transporter = nodemailer.createTransport({
      host: process.env.ORDERS_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.ORDERS_EMAIL_ADDRESS,
        pass: process.env.ORDERS_EMAIL_PASSWORD,
      },
    });

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Verification code sent to ${info.accepted}`);
      }
    });
  },
}));
