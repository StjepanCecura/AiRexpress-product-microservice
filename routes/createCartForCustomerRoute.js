const { commercetoolsClient } = require("../utils/commercetools.js");
const { verifyJWT } = require("../utils/functions.js");

module.exports = async (req, res) => {
  try {
    const token = req.cookies.token;
    const JWTVerification = await verifyJWT(token);

    if (JWTVerification.success == true) {
      const createdCart = await commercetoolsClient.execute({
        method: "POST",
        uri: `/airexpress/carts`,
        body: {
          currency: "EUR",
          taxMode: "Disabled",
          customerId: JWTVerification.user.id,
        },
      });

      res.status(200).send({ cartId: createdCart.body.id });
    } else {
      res.status(403).send({ message: "Not logged in!" });
    }
  } catch (error) {
    console.log(`Error while creating cart! ${error}`);
    res.status(503).send({ error: error });
  }
};
