const Product = require('../models/Product');

// Get all products with optional filtering
exports.getProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products.' });
  }
};