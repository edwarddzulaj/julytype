const AdmZip = require("adm-zip");
const nodemailer = require("nodemailer");

const STRAPI_ORIGIN =
  process.env.STRAPI_ENV === "production"
    ? process.env.STRAPI_URL
    : process.env.STRAPI_TEST_URL;

module.exports = class OrderEmail {
  /**
   * @param {any} products
   */

  constructor(products) {
    this.products = products;
  }

  async retrieveFontURLS() {
    // @ts-ignore
    const fontGroup = this.#getFontDetails(this.products);

    return await Promise.all(
      fontGroup.map(async (group) => {
        const style = await strapi.entityService.findOne(
          "api::style.style",
          group.styleId,
          {
            populate: {
              weights: {
                populate: {
                  clientFontFiles: true,
                },
              },
            },
          }
        );

        let fontURLs = { [style.title]: [] };

        style.weights.forEach((weight) => {
          weight.clientFontFiles.forEach((fontFile) => {
            fontURLs[style.title].push([
              `${style.title} ${weight.title}`,
              fontFile.url,
            ]);
          });
        });

        return fontURLs;
      })
    );
  }

  async zipFonts(fontURLs) {
    const zip = new AdmZip();

    try {
      const promises = [];

      for (const [styleTitle, fonts] of Object.entries(fontURLs)) {
        for (const [fontTitle, url] of fonts) {
          const promise = fetch(STRAPI_ORIGIN + url).then(async (response) => {
            const buffer = await response.arrayBuffer();
            const fileExtension = url.substring(url.lastIndexOf(".") + 1);

            zip.addFile(
              `JT ${styleTitle}/${fontTitle}.${fileExtension}`,
              Buffer.from(buffer)
            );
          });

          promises.push(promise);
        }
      }

      await Promise.all(promises);
      return zip;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async send(zip, clientName, clientEmail) {
    const TEXT_MESSAGE = `Hello ${
      clientName.split(" ")[0]
    } and thank you for purchasing our fonts, we have packaged a zip for you with your order. \r Enjoy!`;

    const message = {
      from: process.env.ORDERS_EMAIL_ADDRESS,
      to: clientEmail,
      subject: "JulyType Purchase",
      text: TEXT_MESSAGE,
      html: `<p>${TEXT_MESSAGE}</p>`,
      attachments: [
        {
          filename: "JT_Typefaces.zip",
          content: zip.toBuffer(),
        },
      ],
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
        console.log(`Message delivered to ${info.accepted}`);
      }
    });
  }

  // @ts-ignore
  #getFontDetails(products) {
    let fontGroup = [];

    products.forEach((product) => {
      const weightsData = JSON.parse(
        product.price_data.product_data.metadata.weights
      );

      weightsData.forEach((weight) => {
        const existingGroup = fontGroup.find(
          (group) => group.styleId === weight.styleId
        );

        if (existingGroup) {
          existingGroup.weights.push(weight);
        } else {
          const newGroup = {
            styleId: weight.styleId,
            weights: [weight],
          };
          fontGroup.push(newGroup);
        }
      });
    });

    return fontGroup;
  }
};
