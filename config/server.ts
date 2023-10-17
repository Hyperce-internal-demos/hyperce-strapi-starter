export default ({ env }) => ({
  url: env("PUBLIC_URL", ""),
  port: env.int("PORT", 3000),
  host: env("HOST", "0.0.0.0"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
