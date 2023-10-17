export default ({ env }) => ({
  email: {
    config: {
      provider: "amazon-ses",
      providerOptions: {
        key: env("AWS_SES_KEY"),
        secret: env("AWS_SES_SECRET"),
        amazon: "https://email.ap-south-1.amazonaws.com",
      },
      settings: {
        defaultFrom: "Hyperce <noreply@hyperce.io>",
      },
    },
  },
});
