const {
  getProduct,
  findVariant,
  findOtherSizes,
  formatCurrentProduct,
  findOtherVariants,
} = require("../utils/functions");

module.exports = async (req, res) => {
  try {
    const productKey = req.query.productKey;
    const variantKey = req.query.variant;
    const product = await getProduct(productKey);
    const allVariants = product?.body?.masterData?.current?.variants;
    const masterVariant = product?.body?.masterData?.current?.masterVariant;
    const currentVariant = findVariant(variantKey, allVariants, masterVariant);

    const masterVariantName = masterVariant?.key.toString()?.split("-size-")[0];
    const masterVariantSize = masterVariant?.key.toString()?.split("-size-")[1];

    const otherSizes = findOtherSizes(currentVariant, allVariants);
    if (
      currentVariant.productKey != masterVariant.key &&
      currentVariant.name == masterVariantName.replaceAll("-", " ")
    )
      otherSizes.push(masterVariantSize);

    let currentProduct = formatCurrentProduct(
      product?.body?.masterData?.current
    );
    const otherVariants = findOtherVariants(
      currentVariant,
      allVariants,
      masterVariant
    );

    currentProduct = {
      ...currentProduct,
      currentVariant: currentVariant,
      otherSizes: otherSizes,
      otherVariants: otherVariants,
    };
    res.status(200).send(currentProduct);
  } catch (error) {
    console.log(`Error while fetching products by category! ${error}`);
    res.status(400).send(error);
  }
};
