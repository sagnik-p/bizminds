const express = require("express");
const app = express();
const router=express.Router();
const product = require("../controller/product");

// Add Product
router.post('/add', product.addProduct);

// Get All Products
router.get("/getAllProducts", product.getAllProducts);

// Delete Selected Product Item
router.get("/delete/:id", product.deleteSelectedProduct);

// Update Selected Product
router.post("/update", product.updateSelectedProduct);

// Search Product By Product Name
router.get("/search_by_name", product.searchProductByName);

//Search Product By Product ID
router.get("/search_by_id",product.searchProductById);

// http://localhost:4000/api/product/search?searchTerm=fa

module.exports = router;
