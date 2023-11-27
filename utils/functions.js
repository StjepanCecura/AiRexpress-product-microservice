const { commercetoolsClient } = require("../utils/commercetools.js");

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

const getCategoryName = async (categoryId) => {
  const category = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/categories/` + categoryId,
  });

  return category.body.name["en-US"];
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

module.exports = { getCategoryName, filterProducts, markdownToHtml };