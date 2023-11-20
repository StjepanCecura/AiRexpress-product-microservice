const ContentfulClient = require("../utils/contentful");

module.exports = async (req, res) => {
  const contentfulClientInstance = new ContentfulClient();
  const client = contentfulClientInstance.getClient();

  client
    .getEntries({
      content_type: "navigationEntry",
    })
    .then((response) => {
      let modifiedResponse = [];
      response.items.map((item) => {
        console.log(item.fields.link);
        let title = item.fields.link.fields.title;
        let slug = item.fields.link.fields.slug;
        let tag = item.fields.link.fields.tag;
        let category = item.fields.link.fields.category;
        const type =
          category != undefined
            ? "category"
            : tag != undefined
            ? "tag"
            : "none";
        modifiedResponse.push({ title, slug, type });
      });
      modifiedResponse.reverse();
      res.status(200).send(modifiedResponse);
    })
    .catch((error) => {
      console.log("Error occurred while fetching entries:", error);
      res.status(400).send(error);
    });
};
