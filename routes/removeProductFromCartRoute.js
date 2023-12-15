const { commercetoolsClient } = require("../utils/commercetools.js");
const { formatProductsInCart } = require("../utils/functions.js");

module.exports = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const lineItemId = req.body.lineItemId;
    const quantity = req.body.quantity;
    const version = req.body.version;

    let body;
    if (quantity) {
      body = {
        version: version,
        actions: [
          {
            action: "removeLineItem",
            lineItemId: lineItemId,
            quantity: quantity,
          },
        ],
      };
    } else {
      body = {
        version: version,
        actions: [
          {
            action: "removeLineItem",
            lineItemId: lineItemId,
          },
        ],
      };
    }
    const cart = await commercetoolsClient.execute({
      method: "POST",
      uri: `/airexpress/carts/${cartId}`,
      body: body,
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
    console.log(`Error while removing product from cart! error:${error}`);
    res.status(400).send(error);
  }
};
