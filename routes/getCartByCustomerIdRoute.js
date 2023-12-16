const { commercetoolsClient } = require("../utils/commercetools.js");
const { verifyJWT } = require("../utils/functions.js");

module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    const JWTVerification = await verifyJWT(token);
    const customerId = JWTVerification.user.id;

    const createdCart = await commercetoolsClient.execute({
      method: "GET",
      uri: `/airexpress/carts/customer-id=${customerId}`,
    });

    res.status(200).send({ cartId: createdCart.body.id });
  } catch (error) {
    console.log(`Error while creating cart! ${error}`);
    if (error.code == 404) res.status(200).send({ cartId: null });
    else res.status(503).send({ error: error });
  }
};
