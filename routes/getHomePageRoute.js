const ContentfulClient = require("../utils/contentful");
const {
  getCategoryName,
  filterProducts,
  markdownToHtml,
  getAllProducts,
} = require("../utils/functions");

module.exports = async (req, res) => {
  console.log(new Date());
  const contentfulClientInstance = new ContentfulClient();
  const client = contentfulClientInstance.getClient();
  client
    .getEntries({
      content_type: "homePage",
      "fields.slug": "home",
    })
    .then(async (response) => {
      let markdownDescription = response?.items[0]?.fields?.description;
      const htmlDesciption = markdownToHtml(markdownDescription);
      const longText = markdownToHtml(
        response?.items[0]?.fields?.footer?.fields?.longText
      );
      const carousel = response?.items[0]?.fields?.carousel?.fields;
      const carouselImages = [];
      carousel?.images?.forEach((image) => {
        carouselImages?.push({
          title: image?.fields?.title,
          description: image?.fields?.description,
          url: image?.fields?.file?.url,
        });
      });

      const categoryId1 = response?.items[0]?.fields?.category1;
      const categoryId2 = response?.items[0]?.fields?.category2;

      const categoryName1 = await getCategoryName(categoryId1 ?? undefined);
      const categoryName2 = await getCategoryName(categoryId2 ?? undefined);

      const allProducts = await getAllProducts();

      const filteredProducts1 = await filterProducts(categoryId1, allProducts);
      const filteredProducts2 = await filterProducts(categoryId2, allProducts);

      const modifiedResponse = {
        title: response?.items[0]?.fields?.title,
        slug: response?.items[0]?.fields?.slug,
        type:
          categoryId1 != undefined
            ? "category"
            : categoryId2 != undefined
            ? "category"
            : "none",
        products1Title: categoryName1,
        products1: categoryId1 == undefined ? undefined : filteredProducts1,
        products2Title: categoryName2,
        products2: categoryId2 == undefined ? undefined : filteredProducts2,
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
      console.log(new Date());

      res.status(200).send(modifiedResponse);
    })
    .catch((error) => {
      console.log("Error occurred while fetching products:", error);
      res.status(400).send(error);
    });
};
