const {
  filterProducts,
  getProductsByCategories,
} = require("../utils/functions");

module.exports = async (req, res) => {
  try {
    const categoryId1 = req.query.categoryId1;
    const categoryId2 = req.query.categoryId2;
    const offset = req.query.offset ?? 0;
    const limit = req.query.limit ?? 12;
    const allProducts = await getProductsByCategories(
      categoryId1,
      categoryId2,
      offset,
      limit
    );
    console.log(allProducts);
    const filteredProducts = await filterProducts(allProducts);
    res.status(200).send({
      products: filteredProducts,
      pagination: {
        offset: allProducts.body.offset,
        count: allProducts.body.count,
        total: allProducts.body.total,
      },
    });
  } catch (error) {
    console.log(`Error while fetching products by category! ${error}`);
    res.status(400).send(error);
  }
};
