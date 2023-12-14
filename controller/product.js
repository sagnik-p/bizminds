const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");

// Add New Product
const addProduct = async (req, res) => {
  try {
      const count = await Product.countDocuments();
      const nextProductId = count + 1;
      const { name, product_info } = req.body;
      const image = req.body.image || '';
      const newProduct = new Product({
          name,
          image,
          product_id: `${nextProductId}`,
          product_info
      });

      await newProduct.save();

      res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const findAllProducts = await Product.find({}).sort({ _id: -1 }); // -1 for descending
    res.json(findAllProducts);
  } catch (error) {
    console.error('Error while fetching all products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  const deleteProduct = await Product.deleteOne(
    { _id: req.params.id }
  );
  const deletePurchaseProduct = await Purchase.deleteOne(
    { ProductID: req.params.id }
  );

  const deleteSaleProduct = await Sales.deleteOne(
    { ProductID: req.params.id }
  );
  res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const updatedResult = await Product.findByIdAndUpdate(
      { _id: req.body.productID },
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
      },
      { new: true }
    );
    console.log(updatedResult);
    res.json(updatedResult);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Product By name
const searchProductByName = async (req, res) => {
  try {
    const productName = req.query.name;
    const products = await Product.find({
      name: { $regex: productName, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    console.error('Error while searching products by name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search Product By ID
const searchProductById=async(req,res)=>{
  try {
    const product_id = req.query.productID;
    const products = await Product.find({
      product_id: product_id,
    });
    res.json(products);
  } catch (error) {
    console.error('Error while searching products by Product ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProductByName,
  searchProductById
};
