module.exports = {
  async afterUpdate(event) {
    const { weights } = event.params.data;

    for (const weight of weights) {
      let weightEntity = await strapi.query("typeface.weight").findOne({
        where: { id: weight.id },
        populate: { typetesterText: true },
      });

      if (weightEntity.typetesterText) {
        for (const typetester of weightEntity.typetesterText) {
          const newTitle = (typetester.title = `${typetester.text.slice(
            0,
            52
          )}...`);

          await strapi.query("typeface.typetester-texts").update({
            where: { id: typetester.id },
            data: {
              title: newTitle,
            },
          });
        }
      }
    }
  },
};
