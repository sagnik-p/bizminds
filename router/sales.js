const express = require("express");
const app = express();
const router=express.Router();
const sales = require("../controller/sales");
const Sales = require("../models/sales");
const Purchase=require("../models/purchase");

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

//Get 12 months of sales for a specific merchant_id
router.get('/:merchant_id/12months_sales', sales.getMonthwiseSales);
  

module.exports = router;



// http://localhost:4000/api/sales/add POST
// http://localhost:4000/api/sales/get GET
