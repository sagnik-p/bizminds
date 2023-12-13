const express = require("express");
const app = express();
const router=express.Router();
const purchase = require("../controller/purchase");
const Purchase=require("../models/purchase");

// Add Purchase
router.post("/add", purchase.addPurchase);

// Get All Purchase Data
router.get('/all_purchases', async (req, res) => {
    try {
        
        // Fetch all documents sorted by date_sold in descending order
        const sortedPurchases = await Purchase.find()
            .sort({ date_purchased: -1 }); // Sorting by date_sold in descending order

        res.json(sortedPurchases); // Return the sorted documents as a JSON response
    } catch (error) {
        console.error('Error while fetching Merchant Purchases:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/get/:userID/totalpurchaseamount", purchase.getTotalPurchaseAmount);

module.exports = router;

// http://localhost:4000/api/purchase/add POST
// http://localhost:4000/api/purchase/get GET
