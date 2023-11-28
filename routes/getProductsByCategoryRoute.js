const {
  getCategoryName,
  filterProducts,
  getAllProducts,
} = require("../utils/functions");

module.exports = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const categoryName = await getCategoryName(categoryId ?? undefined);
    const allProducts = await getAllProducts();
    console.log(allProducts.body.results);
    const filteredProducts = await filterProducts(categoryId, allProducts);
    res.status(200).send({ categoryName, filteredProducts });
  } catch (error) {
    console.log(`Error while fetching products by category! ${error}`);
    res.status(400).send(error);
  }
};
