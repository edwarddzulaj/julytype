module.exports = ({ env }) => ({
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        typeface: {
          field: "slug",
          references: "title",
        },
        style: {
          field: "slug",
          references: "title",
        },
        "simple-page": {
          field: "slug",
          references: "title",
        },
      },
      shouldUpdateSlug: true,
    },
  },
  "import-export-entries": {
    enabled: true,
  },
});
