module.exports = ({ env }) => ({
    url: env("RENDER_EXTERNAL_URL"),
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    dirs: {
        public: "/data/public"
    },
});