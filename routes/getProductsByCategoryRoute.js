const {
  getCategoryName,
  filterProducts,
  getAllProducts,
} = require("../utils/functions");

module.exports = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const offset = req.query.offset ?? 0;
    const categoryName = await getCategoryName(categoryId ?? undefined);
    const allProducts = await getAllProducts(categoryId, offset);
    console.log(allProducts);
    const filteredProducts = await filterProducts(allProducts);
    res.status(200).send({
      categoryName,
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
