const { commercetoolsClient } = require("../utils/commercetools.js");

module.exports = async (req, res) => {
  try {
    const cartId = req.query.cartId;
    const cart = await commercetoolsClient.execute({
      method: "GET",
      uri: `/airexpress/carts/${cartId}`,
    });

    res.status(200).send({ cart: cart.body });
  } catch (error) {
    console.log(`Error while fetching cart data by card id! error:${error}`);
    res.status(400).send(error);
  }
};
