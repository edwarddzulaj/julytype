module.exports = {
  async afterUpdate(event) {
    const { weights } = event.params.data;

    for (const weight of weights) {
      let weightEntity = await strapi.query("typeface.weight").findOne({
        where: { id: weight.id },
        populate: {
          typetesterLanguageGroup: {
            populate: { sample: true },
          },
        },
      });

      if (weightEntity.typetesterLanguageGroup) {
        for (const langGroup of weightEntity.typetesterLanguageGroup) {
          for (const sample of langGroup.sample) {
            const newTitle = `${sample.text.slice(0, 52)}...`;

            await strapi.query("typeface.sample-text").update({
              where: { id: sample.id },
              data: {
                title: newTitle,
              },
            });
          }
        }
      }
    }
  },
};
