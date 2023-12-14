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
router.get("/get/:merchant_id", sales.getSalesData);
router.get("/get/monthly_sales/:merchant_id", sales.getMonthlySales);


router.get("/get/totalsaleamount/:merchant_id", sales.getTotalSalesAmount);
router.get("/get/totalprofit/:merchant_id", sales.getTotalProfit);

//Get Profit based on Day
//Request Body:
// {
//   "merchant_id":"m50",
//   "date":"11/8/2023"
// }
router.post('/profit_by_day', sales.getProfitByDay);


//Get monthly profit
// The request looks like 
// {
//   "merchant_id":"m50",
//   "month":"November"
// }
router.post("/monthly_profit", sales.getProfitByMonth);

router.get('/all_sales', sales.getAllSales);
  

module.exports = router;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
