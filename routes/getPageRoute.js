const ContentfulClient = require("../utils/contentful");
const {
  filterProducts,
  markdownToHtml,
  getAllProducts,
} = require("../utils/functions");

module.exports = async (req, res) => {
  const contentfulClientInstance = new ContentfulClient();
  const client = contentfulClientInstance.getClient();
  const slug = req.query.slug;
  client
    .getEntries({
      content_type: "page",
      "fields.slug": slug,
    })
    .then(async (response) => {
      let markdownDescription = response.items[0]?.fields?.description;
      const htmlDesciption = markdownToHtml(markdownDescription);
      const longText = markdownToHtml(
        response?.items[0]?.fields?.footer?.fields?.longText
      );
      const carousel = response?.items[0]?.fields?.carousel?.fields;

      const carouselImages = [];
      carousel?.images?.forEach((image) => {
        carouselImages.push({
          title: image?.fields?.title,
          description: image?.fields?.description,
          url: image?.fields?.file?.url,
        });
      });

      const categoryId = response?.items[0]?.fields?.category;

      const allProducts = await getAllProducts();
      const filteredProducts = await filterProducts(categoryId, allProducts);

      const modifiedResponse = {
        title: response?.items[0]?.fields?.title,
        slug: response?.items[0]?.fields?.slug,
        type: categoryId != undefined ? "category" : "none",
        products: filteredProducts ?? "none",
        description: htmlDesciption,
        header: {
          title: response?.items[0]?.fields?.header?.fields?.title,
          description:
            response?.items[0]?.fields?.header?.fields?.shortDescription,
          image: {
            title:
              response?.items[0]?.fields?.header?.fields?.image?.fields?.title,
            description:
              response?.items[0]?.fields?.header?.fields?.image?.fields
                ?.description,
            url: response?.items[0]?.fields?.header?.fields?.image?.fields?.file
              ?.url,
          },
        },
        footer: {
          email: response?.items[0]?.fields?.footer?.fields?.email,
          phoneNumber: response?.items[0]?.fields?.footer?.fields?.phoneNumber,
          longText: longText,
          image: {
            title:
              response?.items[0]?.fields?.footer?.fields?.footerImage?.fields
                ?.title,
            description:
              response?.items[0]?.fields?.footer?.fields?.footerImage
                ?.description,
            url: response?.items[0]?.fields?.footer?.fields?.footerImage?.fields
              ?.file?.url,
          },
        },
        carousel:
          carouselImages?.length == 0
            ? undefined
            : {
                images: carouselImages,
              },
      };
      res.status(200).send(modifiedResponse);
    })
    .catch((error) => {
      console.log("Error occurred while fetching products:", error);
      res.status(400).send(error);
    });
};
