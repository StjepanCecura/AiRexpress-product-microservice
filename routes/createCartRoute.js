const { commercetoolsClient } = require("../utils/commercetools.js");

module.exports = async (req, res) => {
  try {
    const createdCart = await commercetoolsClient.execute({
      method: "POST",
      uri: `/airexpress/carts`,
      body: { currency: "EUR" },
    });

    res.status(200).send({ cartId: createdCart.body.id });
  } catch (error) {
    console.log(`Error while creating cart! ${error}`);
    res.status(503).send({ error: error });
  }
};
