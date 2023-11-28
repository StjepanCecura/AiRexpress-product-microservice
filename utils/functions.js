const { commercetoolsClient } = require("../utils/commercetools.js");

const markdownToHtml = (markdownDescription) => {
  if (markdownDescription == undefined) return "";

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
  if (categoryId == undefined) return undefined;
  const category = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/categories/` + categoryId,
  });
  return category?.body?.name?.["en-US"];
};

const getAllProducts = async (categoryId, offset, limit) => {
  const allProducts = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/products?limit=${limit}&offset=${offset}&where=masterData%28current%28categories%28id%3D%22${categoryId}%22%29%29%29`,
  });

  return allProducts;
};

const filterProducts = async (allProducts) => {
  const filteredProducts = [];
  allProducts?.body?.results?.forEach((product) => {
    filteredProducts.push({
      productKey: product?.key,
      name: product?.masterData?.current?.name?.["en-US"],
      variantKey: product?.masterData?.current?.masterVariant?.key,
      regularPrice:
        product?.masterData?.current?.masterVariant?.prices[0]?.value
          ?.centAmount / 100,
      discountPrice:
        product?.masterData?.current?.masterVariant?.prices[0]?.discounted
          ?.value?.centAmount / 100,
      images: product?.masterData?.current?.masterVariant?.images,
      categories: product?.masterData?.current?.categories,
    });
  });

  return filteredProducts;
};

module.exports = {
  getCategoryName,
  filterProducts,
  markdownToHtml,
  getAllProducts,
};
