const fs = require("fs");
const path = require("path");
const stream = require("stream");
const lodash = require("lodash");

async function isInitialized(strapi) {
  try {
    if (lodash.isEmpty(strapi.admin)) return true;

    // test if there is at least one admin
    const anyAdministrator = await strapi
      .query("admin::user")
      .findOne({ select: ["id"] });

    return !lodash.isNil(anyAdministrator);
  } catch (err) {
    strapi.stopWithError(err);
  }
}

module.exports = (config, { strapi }) => {
  const landingPageDisabled = process.env.DISABLE_LANDING_PAGE === "true";

  const index = fs.readFileSync(
    path.join(process.cwd(), "public", "index.html"),
    "utf8",
  );

  async function handler(ctx, next) {
    // if admin page is disabled, redirect directly to dashboard
    if (landingPageDisabled) return ctx.redirect(strapi.config.admin.url);

    const content = lodash.template(index)({
      serverTime: new Date().toUTCString(),
      isInitialized: await isInitialized(strapi),
      ...lodash.pick(strapi, [
        "config.info.version",
        "config.info.name",
        "config.admin.url",
        "config.server.url",
        "config.environment",
        "config.serveAdminPanel",
      ]),
    });

    ctx.type = "html";
    ctx.body = stream.Readable({
      read() {
        this.push(Buffer.from(content));
        this.push(null);
      },
    });
  }

  const redirects = ["/", "index.html"].map((path) => ({
    path,
    handler,
    method: "GET",
    config: { auth: false },
  }));

  strapi.server.routes(redirects);
};
