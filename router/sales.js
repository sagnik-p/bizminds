const express = require("express");
const app = express();
const router=express.Router();
const sales = require("../controller/sales");
const Sales = require("../models/sales");
const Purchase=require("../models/purchase");

function getMonthNumber(monthName) {
    const months = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };

    // Convert the month name to title case (e.g., "january" to "January")
    const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

    return months[formattedMonth] || null;
}

// Add Sales
router.post("/add", sales.addSales);

// Get All Sales
router.get("/get/:userID", sales.getSalesData);
router.get("/getmonthly", sales.getMonthlySales);


router.get("/get/:userID/totalsaleamount", sales.getTotalSalesAmount);
router.get("/get/:userID/totalprofit", sales.getTotalProfit);

//Get monthly profit
// The request looks like 
// {
//   "merchant_id":"m50",
//   "month":"November"
// }
router.post("/monthly_profit", async (req, res) => {
    try {
      const merchant_id = req.body.merchant_id;
      const month = getMonthNumber(req.body.month);
      console.log(merchant_id, month);
      if (!month) {
        res.json({ error: "Wrong month name!!" });
        return; // Return to prevent further execution
      }
  
      const filteredSales = await Sales.find({
        merchant_id: merchant_id,
        date_sold: {
          $regex: `(?:^|[^0-9])${month}(?:\/|$)`
        }
      });
  
      console.log('Filtered Sales:', filteredSales);
  
      const productIDs = filteredSales.map(sale => sale.product_id);
  
      const merchantPurchases = await Purchase.find({
        merchant_id: merchant_id,
        product_id: { $in: productIDs }
      });
  
      console.log('Product Ids and merchant_purchases:', productIDs, merchantPurchases);
  
      const profits = filteredSales.map(sale => {
        const correspondingPurchase = merchantPurchases.find(purchase => purchase.product_id === sale.product_id);
  
        if (correspondingPurchase) {
          const profit = ((sale.selling_price_per_unit - correspondingPurchase.cost_price_per_unit) * sale.units_sold).toFixed(2);
          console.log("Profit:", profit);
          return {
            product_id: sale.product_id,
            profit: profit
          };
        } else {
          return null;
        }
      }).filter(Boolean);
  
      const totalProfit = profits.reduce((acc, curr) => acc + parseFloat(curr.profit), 0).toFixed(2);
  
      res.json({ profits: profits, total_profit: totalProfit });
    } catch (error) {
      console.error('Error while finding profit:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/all_sales', async (req, res) => {
    try {
        // const customerSalesCollection = db.collection("customer_sales");
        
        // Fetch all documents sorted by date_sold in descending order
        const sortedSales = await Sales.find()
            .sort({ date_sold: -1 }); // Sorting by date_sold in descending order

        res.json(sortedSales); // Return the sorted documents as a JSON response
    } catch (error) {
        console.error('Error while fetching customer sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

module.exports = router;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
