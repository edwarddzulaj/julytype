"use strict";

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
  async sendTypefacesToEmail(email, products) {
    const orderEmail = new OrderEmail(products);

    const fontURLs = await orderEmail.retrieveFontURLS();
    const zip = await orderEmail.zipFonts(fontURLs[0]);

    // zip.writeZip("zip-test.zip");
    // console.log(zip.getEntries());

    // Done - get all typefaces and their weights
    // Done - get the files
    // insert the metadata in them (orderId, name, email, ?)
    // Done - zip all of them
    // send them to the email
    // generate invoice?

    console.log("Sending typefaces to ", email, "...");
  },
}));
