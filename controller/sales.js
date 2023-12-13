const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const Purchase = require("../models/purchase");

// Add Sales data
const addSales=async (req, res) => {
  try {
    // Destructure values from the request body
    const { merchant_id, date_sold, product_id, selling_price_per_unit, total_selling_price, units_sold } = req.body;

    // Create a new Sale instance
    const newSale = new Sales({
      merchant_id,
      date_sold,
      product_id,
      selling_price_per_unit,
      total_selling_price,
      units_sold
    });

    // Save the new sale to the database
    const savedSale = await newSale.save();

    // Return a success message with the saved sale data
    res.status(201).json({ message: 'Sale added successfully', sale: savedSale });
  } catch (error) {
    console.error('Error adding sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({"userID": req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID")
    .populate("StoreID"); // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async(req,res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  res.json({totalSaleAmount});

}

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0)

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;

      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getTotalProfit = async(req,res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  let totalPurchaseAmount = 0;
  const purchaseData = await Purchase.find({"userID": req.params.userID});
  purchaseData.forEach((purchase) => {
    totalPurchaseAmount += purchase.TotalPurchaseAmount;
  })
  let totalProfit=totalSaleAmount-totalPurchaseAmount;
  res.json( {totalProfit} );
}

module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount, getTotalProfit};
