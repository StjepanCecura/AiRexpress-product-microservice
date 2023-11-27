const { createClient } = require("@commercetools/sdk-client");
const {
  createAuthMiddlewareForClientCredentialsFlow,
} = require("@commercetools/sdk-middleware-auth");
const {} = require("@commercetools/platform-sdk");
const { createHttpMiddleware } = require("@commercetools/sdk-middleware-http");
const fetch = require("node-fetch");

const projectKey = process.env.PROJECT_KEY;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authHost = process.env.AUTH_HOST;
const httpHost = process.env.HTTP_HOST;

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
  host: authHost,
  projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  fetch,
});

const httpMiddleware = createHttpMiddleware({
  host: httpHost,
  fetch,
});

const commercetoolsClient = createClient({
  middlewares: [authMiddleware, httpMiddleware],
});

module.exports = { commercetoolsClient };
