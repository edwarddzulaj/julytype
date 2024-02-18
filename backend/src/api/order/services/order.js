"use strict";

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
}));
