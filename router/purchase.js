const express = require("express");
const app = express();
const router=express.Router();
const purchase = require("../controller/purchase");
const Purchase=require("../models/purchase");

// Add Purchase Data
router.post("/add", purchase.addPurchase);

// Get Purchase Data of every merchant in the system
router.get('/all_purchases', purchase.allPurchaseData);

//Get Purchase Data for a particular merchant
router.get("/get/purchase_data/:merchantID", purchase.getPurchaseData);

//Get total Purchase amount for a particular merchant
router.get("/get/totalpurchaseamount/:merchantID", purchase.getTotalPurchaseAmount);

module.exports = router;

// http://localhost:4000/api/purchase/add POST
// http://localhost:4000/api/purchase/get GET
