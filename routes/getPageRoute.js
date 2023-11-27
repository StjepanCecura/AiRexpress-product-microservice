const ContentfulClient = require("../utils/contentful");
const { commercetoolsClient } = require("../utils/commercetools.js");

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
      let markdownDescription = response.items[0].fields.description;
      const htmlDesciption = markdownToHtml(markdownDescription);
      const longText = markdownToHtml(
        response.items[0].fields.footer.fields.longText
      );
      const carousel = response.items[0].fields.carousel.fields;
      const carouselImages = [];
      carousel.images.map((image) => {
        carouselImages.push({
          title: image.fields.title,
          description: image.fields.description,
          url: image.fields.file.url,
        });
      });

      let categoryId = response.items[0].fields.category;

      const filteredProducts = await filterProducts(categoryId);

      const modifiedResponse = {
        title: response.items[0].fields.title,
        slug: response.items[0].fields.slug,
        type: categoryId != undefined ? "category" : "none",
        products: filteredProducts ?? "none",
        description: htmlDesciption,
        header: {
          title: response.items[0].fields.header.fields.title,
          description: response.items[0].fields.header.fields.shortDescription,
          image: {
            title: response.items[0].fields.header.fields.image.fields.title,
            description:
              response.items[0].fields.header.fields.image.fields.description,
            url: response.items[0].fields.header.fields.image.fields.file.url,
          },
        },
        footer: {
          email: response.items[0].fields.footer.fields.email,
          phoneNumber: response.items[0].fields.footer.fields.phoneNumber,
          longText: longText,
          image: {
            title:
              response.items[0].fields.footer.fields.footerImage.fields.title,
            description:
              response.items[0].fields.footer.fields.footerImage.description,
            url: response.items[0].fields.footer.fields.footerImage.fields.file
              .url,
          },
        },
        carousel: {
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

const markdownToHtml = (markdownDescription) => {
  let htmlDesciption = markdownDescription;
  const newLineRegex = /\n/g;
  const boldRegex = /__(.*?)__/g;
  const imageRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  htmlDesciption = htmlDesciption.replace(newLineRegex, "<br/>");
  htmlDesciption = htmlDesciption.replace(boldRegex, "<strong>$1</strong>");
  htmlDesciption = htmlDesciption.replace(
    imageRegex,
    '<a style="color:blue; text-decoration:underline" href="$2">$1</a>'
  );

  return htmlDesciption;
};

const filterProducts = async (categoryId) => {
  const allProducts = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/products`,
  });

  const filteredProducts = [];
  allProducts.body.results.map((product) => {
    let match = false;
    product.masterData.current.categories.map((category) => {
      if (category.id == categoryId) match = true;
    });
    if (match) {
      console.log(product.masterData.current);
      filteredProducts.push({
        productKey: product.key,
        name: product.masterData.current.name["en-US"],
        variantKey: product.masterData.current.masterVariant.key,
        regularPrice:
          product.masterData.current.masterVariant.prices[0].value.centAmount /
          100,
        discountPrice:
          product?.masterData?.current?.masterVariant?.prices[0]?.discounted
            ?.value?.centAmount / 100,
        images: product.masterData.current.masterVariant.images,
      });
    }
  });

  return filteredProducts;
};
