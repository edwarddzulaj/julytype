module.exports = ({ env }) => ({
    url: env("RENDER_EXTERNAL_URL"),
    port: env.int('PORT', 1337),
    dirs: {
        public: "/data/public"
    },
});