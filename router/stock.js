const express = require("express");
const router=express.Router();
const Stock = require("../models/stocks.js");

router.get('/inventory', async (req, res) => {
    try {
        // const stockCollection = db.collection("stocks");

        // Regex pattern to match user_id starting with 'm'
        const regexPattern = /^m/i; // ^m matches 'm' at the beginning, 'i' makes it case insensitive

        // Query the stock collection for documents for Merchant IDs
        const merchantStock = await Stock.find({ user_id: regexPattern });

        res.json(merchantStock);
    } catch (error) {
        console.error('Error while fetching Merchant Stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/inventory/:merchant_id', async (req, res) => {
    try {
        // const stockCollection = db.collection("stocks");

        // Regex pattern to match user_id starting with 'm'
        const merchant_id = req.params.merchant_id; // ^m matches 'm' at the beginning, 'i' makes it case insensitive

        // Query the stock collection for documents for Merchant IDs
        const merchantStock = await Stock.find({ user_id: merchant_id });

        res.json(merchantStock);
    } catch (error) {
        console.error('Error while fetching Merchant Stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports=router;