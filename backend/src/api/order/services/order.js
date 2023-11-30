"use strict";

const { values } = require("../../../../config/middlewares.js");
const OrderEmail = require("./OrderEmail.js");

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({}) => ({
  /**
   * @param {string} email
   * @param {any} products
   */
  async sendTypefacesToEmail(name, email, products) {
    const orderEmail = new OrderEmail(products);

    const fontURLs = await orderEmail.retrieveFontURLS();
    const zip = await orderEmail.zipFonts(fontURLs[0]);
    orderEmail.send(zip, name, email);
  },
}));
