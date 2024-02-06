const AdmZip = require("adm-zip");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const STRAPI_ORIGIN =
  process.env.STRAPI_ENV === "production"
    ? process.env.STRAPI_URL
    : process.env.STRAPI_TEST_URL;

const WEB_FONT_FORMATS = ['.woff', '.woff2'];
module.exports = class OrderEmail {
  /**
   * @param {any} products
   */

  constructor(products) {
    this.products = products;
  }

  async retrieveFontURLs() {
    // @ts-ignore
    const fontGroup = this.#getFontDetails(this.products);

    return await Promise.all(
      fontGroup.map(async (group) => {
        let fontURLs = {};

        if (group.isVariableFont) {
          const typefaceEntity = await strapi.entityService.findOne(
            "api::typeface.typeface", group.typefaceId,
            {
              populate: {
                variableFont: {
                  populate: {
                    fontFiles: true,
                  },
                },
              },
            }
          );

          const variableFont = typefaceEntity.variableFont;
          const groupKey = `${typefaceEntity.title} Variable`;

          fontURLs = { ...fontURLs, [groupKey]: [] };
          variableFont.fontFiles.forEach((fontFile) => {
            if (WEB_FONT_FORMATS.includes(fontFile.ext) && !group.needsWebFonts) return;

            fontURLs[groupKey].push([
              groupKey,
              fontFile.url,
            ]);
          });
        } else {
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

          fontURLs = { ...fontURLs, [style.title]: [] };
          group.weights.forEach((weight) => {
            const selectedWeight = style.weights.find((w) => w.id === weight.id);
            selectedWeight.clientFontFiles.forEach((fontFile) => {
              if (WEB_FONT_FORMATS.includes(fontFile.ext) && !group.needsWebFonts) return;

              fontURLs[style.title].push([
                `${style.title} ${selectedWeight.title}`,
                fontFile.url,
              ]);
            });
          });
        }

        return fontURLs;
      })
    );
  }

  async zipFonts(fontURLs) {
    const zip = new AdmZip();

    try {
      const promises = [];

      fontURLs.forEach((fontGroup) => {
        for (const [styleTitle, fonts] of Object.entries(fontGroup)) {
          for (const [fontTitle, url] of fonts) {
            const promise = fetch(STRAPI_ORIGIN + url).then(
              async (response) => {
                const buffer = await response.arrayBuffer();
                const fileExtension = url.substring(url.lastIndexOf(".") + 1);

                zip.addFile(
                  `JT ${styleTitle}/${fontTitle}.${fileExtension}`,
                  Buffer.from(buffer)
                );
              }
            );

            promises.push(promise);
          }
        }
      });

      await Promise.all(promises);
      return zip;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  }

  async send(zip, clientName, clientEmail) {
    const TEXT_MESSAGE = `Hello ${clientName.split(" ")[0]
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
      const weightsData = Object.entries(product.price_data.product_data.metadata)
        .filter(([key]) => key.includes('Weight'))
        .map(([_, value]) => {
          return JSON.parse(value);
        });

      const licensesData = JSON.parse(product.price_data.product_data.metadata.licenses).licenseTypes;
      const needsWebFonts = licensesData.includes('web');

      weightsData.forEach((weight) => {
        const existingGroup = fontGroup.find(
          (group) => group.styleId === weight.styleId
        );

        if (existingGroup) {
          existingGroup.weights.push(weight);
        } else {
          const newGroup = {
            typefaceId: weight.typefaceId,
            styleId: weight.styleId,
            isVariableFont: weight.isVariableFont,
            needsWebFonts: needsWebFonts,
            weights: [weight],
          };
          fontGroup.push(newGroup);
        }
      });
    });

    return fontGroup;
  }
};
