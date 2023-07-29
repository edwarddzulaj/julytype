module.exports = ({ env }) => ({
    url: env("RENDER_EXTERNAL_URL"),
    port: 1337,
    dirs: {
        public: "/data/public"
    },
});