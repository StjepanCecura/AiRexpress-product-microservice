const { commercetoolsClient } = require("../utils/commercetools.js");
const { formatProductsInCart } = require("../utils/functions.js");

module.exports = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const version = req.body.version;
    const productId = req.body.productId;
    const variantId = req.body.variantId;
    const quantity = req.body.quantity;

    const cart = await commercetoolsClient.execute({
      method: "POST",
      uri: `/airexpress/carts/${cartId}`,
      body: {
        version: version,
        actions: [
          {
            action: "addLineItem",
            productId: productId,
            variantId: parseInt(variantId),
            quantity: parseInt(quantity),
          },
        ],
      },
    });

    const formatedProduct = formatProductsInCart(cart.body.lineItems);

    res.status(200).send({
      cartId: cart.body.id,
      products: formatedProduct,
      state: cart.body.cartState,
      totalPrice: cart.body.totalPrice.centAmount / 100,
      currency: cart.body.totalPrice.currencyCode,
    });
  } catch (error) {
    console.log(`Error while adding product to cart! error:${error}`);
    res.status(400).send(error);
  }
};
