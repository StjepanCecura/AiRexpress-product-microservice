const contentful = require("contentful");
const dotenv = require("dotenv");

dotenv.config();

class ContentfulClient {
  constructor() {
    if (!ContentfulClient.instance) {
      this.client = contentful.createClient({
        space: process.env.SPACE_ID,
        accessToken: process.env.ACCESS_TOKEN,
      });
      ContentfulClient.instance = this;
    }
    return ContentfulClient.instance;
  }

  getClient() {
    return this.client;
  }
}

module.exports = ContentfulClient;
