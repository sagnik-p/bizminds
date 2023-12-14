const express = require("express");
const app = express();
const router=express.Router();
const supplier = require("../controller/supplier.js");
const Supplier = require("../models/suppliers.js");
const Product=require("../models/product.js");

// Add Supplier
router.post("/add", supplier.addSupplier);

//rating:[Average rating,Delivery,Quality,Responsiveness,Price]
//Get all suppliers sorted according to various rating parameters
router.get('/:rating_index', supplier.rating_review);

//Get Supplier Info By SupplierID
router.get('/get_supplier/:supplier_id', supplier.getSupplierByID);

//Get Supplier Info By ProductID
router.get('/by_productID/:product_id', supplier.getSupplierByProductID);

//Get Supplier Info By Product Name
router.get('/by_product_name/:name', supplier.getSupplierByProductName);

  

module.exports = router;
