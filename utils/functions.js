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

const getProduct = async (productKey) => {
  const product = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/products/key=` + productKey,
  });
  return product;
};

const getAllProducts = async (categoryId, offset, limit) => {
  const allProducts = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/products?limit=${limit}&offset=${offset}&where=masterData%28current%28categories%28id%3D%22${categoryId}%22%29%29%29`,
  });

  return allProducts;
};

const getProductsByCategories = async (
  categoryId1,
  categoryId2,
  offset,
  limit
) => {
  const allProducts = await commercetoolsClient.execute({
    method: "GET",
    uri: `/airtim1-webshop-i-cms/products?limit=${limit}&offset=${offset}&where=masterData%28current%28categories%28id%3D%22${categoryId1}%22%20%29%20AND%20categories%28id%3D%22${categoryId2}%22%29%29%29`,
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

const findVariant = (variantKey, allVariants, masterVariant) => {
  let desiredVariant;
  if (masterVariant.key != variantKey) {
    desiredVariant = allVariants.find((variant) => variant.key == variantKey);
  } else desiredVariant = masterVariant;
  desiredVariant = formatVariant(desiredVariant);
  return desiredVariant;
};

const findOtherSizes = (variant, allVariants) => {
  const splitedVariantKey = variant?.productKey.split("-size-");
  const variantName = splitedVariantKey[0];
  const variantSizes = [];

  allVariants.forEach((v) => {
    if (
      v.key.toString().includes(variantName) &&
      v.key.toString() != variant.productKey
    ) {
      let totalQuantity = 0;
      let onStock = false;
      const channels = v?.availability?.channels;
      for (let key in channels) {
        totalQuantity += channels[key].availableQuantity;
        if (channels[key].isOnStock) {
          onStock = true;
        }
      }
      const currentSize = v?.key?.toString().split("-size-")[1];
      variantSizes.push({
        key: v?.key,
        size: currentSize,
        availability: {
          isOnStock: onStock,
          quantity: totalQuantity,
        },
      });
    }
  });
  return variantSizes;
};

const formatVariant = (variant) => {
  const splitedVariantKey = variant?.key.split("-size-");
  const variantName = splitedVariantKey[0];
  const currentVariantSize = splitedVariantKey[1];
  let totalQuantity = 0;
  let onStock = false;
  const channels = variant?.availability?.channels;
  for (let key in channels) {
    totalQuantity += channels[key].availableQuantity;
    if (channels[key].isOnStock) {
      onStock = true;
    }
  }
  const formatedVariant = {
    productKey: variant?.key,
    name: variantName.replaceAll("-", " "),
    currentSize: currentVariantSize,
    images: variant?.images,
    availability: {
      isOnStock: onStock,
      quantity: totalQuantity,
    },
  };
  return formatedVariant;
};

const formatCurrentProduct = (product) => {
  const formatedProduct = {
    name: product?.name["en-US"],
    description: product?.description["en-US"],
    regularPrice: product?.masterVariant?.prices[0]?.value?.centAmount / 100,
    discountPrice:
      product?.masterVariant?.prices[0]?.discounted?.value?.centAmount / 100,
  };

  return formatedProduct;
};

const findOtherVariants = (currentVariant, allVariants, masterVariant) => {
  const splitedVariantKey = currentVariant?.productKey?.split("-size-");
  const variantName = splitedVariantKey[0];
  const splitedMasterKey = masterVariant?.key?.split("-size-");
  const masterVariantName = splitedMasterKey[0];
  const otherVariants = [];
  if (variantName != masterVariantName) {
    otherVariants.push({
      variantKey: masterVariant.key,
      name: masterVariantName,
      images: masterVariant.images,
    });
  }
  allVariants.forEach((variant) => {
    if (!variant.key.toString()?.includes(variantName)) {
      const currentName = variant?.key?.split("-size-")[0];
      const exists = otherVariants.some((x) => {
        return x.name == currentName;
      });
      if (!exists)
        otherVariants.push({
          variantKey: variant.key,
          name: currentName,
          images: variant.images,
        });
    }
  });

  return otherVariants;
};

module.exports = {
  getCategoryName,
  filterProducts,
  markdownToHtml,
  getAllProducts,
  getProductsByCategories,
  getProduct,
  findVariant,
  findOtherSizes,
  formatCurrentProduct,
  findOtherVariants,
};
