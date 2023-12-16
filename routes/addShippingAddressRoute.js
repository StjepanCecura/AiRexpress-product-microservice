const { commercetoolsClient } = require("../utils/commercetools.js");

module.exports = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const version = req.body.version;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const postalCode = req.body.postalCode;
    const streetName = req.body.streetName;
    const streetNumber = req.body.streetNumber;
    const city = req.body.city;
    const country = req.body.country;

    const cart = await commercetoolsClient.execute({
      method: "POST",
      uri: `/airexpress/carts/${cartId}`,
      body: {
        version: version,
        actions: [
          {
            action: "setShippingAddress",
            address: {
              key: firstName + "-" + lastName,
              firstName,
              lastName,
              email,
              phone,
              postalCode,
              country,
              streetName,
              streetNumber,
              city,
            },
          },
        ],
      },
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(`Error adding shipping address! ${error}`);
    res.status(503).send({ error });
  }
};
