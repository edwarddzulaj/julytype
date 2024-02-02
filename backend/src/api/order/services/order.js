"use strict";

const OrderEmail = require("./OrderEmail.js");

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ }) => ({
  /**
   * @param {string} email
   * @param {any} products
   */
  async sendTypefacesToEmail(name, email, products) {
    const orderEmail = new OrderEmail(products);
    const fontURLs = await orderEmail.retrieveFontURLs();
    const zip = await orderEmail.zipFonts(fontURLs);
    orderEmail.send(zip, name, email);
  },
}));
