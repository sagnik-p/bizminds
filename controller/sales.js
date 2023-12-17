const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const Purchase = require("../models/purchase");

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
  try {
    const { merchant_id } = req.params;

    // Find sales data based on the provided merchant_id and sort by date_sold in descending order
    const salesData = await Sales.find({ merchant_id }).sort({ date_sold: -1 });

    // Preprocess dates to make them sortable
    salesData.forEach(sale => {
      const [month, day, year] = sale.date_sold.split('/');
      const dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      sale.sortable_date = dateObj;
    });

    // Sort based on the preprocessed dates
    salesData.sort((a, b) => b.sortable_date - a.sortable_date);

    // Remove the temporary sortable_date field from the response
    salesData.forEach(sale => delete sale.sortable_date);

    // Return the sorted sales data
    res.status(200).json({ salesData });
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  try {
    const { merchant_id } = req.params;

    // Find sales data based on the provided merchant_id
    const salesData = await Sales.find({ merchant_id });

    // Calculate total sales amount
    const totalSalesAmount = salesData.reduce((total, sale) => total + sale.total_selling_price, 0);

    // Return the total sales amount
    res.status(200).json({ merchant_id:merchant_id, Total_Sales_Amount: totalSalesAmount });
  } catch (error) {
    console.error('Error calculating total sales amount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMonthlySales = async (req, res) => {
  try {
    console.log(req.body);
    const merchant_id = req.body.merchant_id;
    const month = getMonthNumber(req.body.month);
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

    const totalMonthlyAmount = filteredSales.reduce((total, sale) => total + sale.total_selling_price, 0);

    res.status(200).json({ Monthly_Sale_Amount:totalMonthlyAmount , Sales_Data:filteredSales });
  } catch (error) {
    console.error('Error calculating Monthly Sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTotalProfit = async (req, res) => {
  try {
    const { merchant_id } = req.params;

    // Calculate total selling price
    const totalSellingPrice = await Sales.aggregate([
      { $match: { merchant_id } },
      { $group: { _id: null, total: { $sum: '$total_selling_price' } } }
    ]);

    // Calculate total cost price
    const totalCostPrice = await Purchase.aggregate([
      { $match: { merchant_id } },
      { $group: { _id: null, total: { $sum: '$total_cost_price' } } }
    ]);

    const totalSelling = totalSellingPrice.length ? totalSellingPrice[0].total : 0;
    const totalCost = totalCostPrice.length ? totalCostPrice[0].total : 0;

    // Calculate profit
    const totalProfit = totalSelling - totalCost;

    res.status(200).json({ Total_SP:totalSelling,Total_CP:totalCost,Total_Profit:totalProfit });
  } catch (error) {
    console.error('Error calculating total profit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProfitByDay=async (req, res) => {
  try {
    const { merchant_id, date } = req.body;

    // Retrieve sales data from 'customer_sales'
    const customerSales = await Sales.find({
      merchant_id: merchant_id,
      date_sold: date
    });
    console.log("Customer Sales:",customerSales)

    // Collect product IDs and selling price per unit
    const productSellPrice = {};
    customerSales.forEach((sale) => {
      productSellPrice[sale.product_id] = sale.selling_price_per_unit;
    });

    // Retrieve purchase data from 'merchant_purchases' based on product IDs
    const products = Object.keys(productSellPrice);
    const productCostPrice = {};

    for (const product_id of products) {
      const costPriceData = await Purchase.findOne({
        merchant_id: merchant_id,
        product_id: product_id
      });

      if (costPriceData) {
        productCostPrice[product_id] = costPriceData.cost_price_per_unit;
      } else {
        console.log(`No cost price data found for product ID: ${product_id}`);
      }
    }

    // Calculate profit for each product and accumulate total profit
    const profits = [];
    let totalProfit = 0;

    for (const product_id in productSellPrice) {
      if (productCostPrice[product_id] !== undefined) {
        const unitsSold = customerSales.find(sale => sale.product_id === product_id).units_sold;
        const profit = (productSellPrice[product_id] - productCostPrice[product_id]) * unitsSold;
        totalProfit += profit;
        profits.push({ product_id: product_id, profit: profit.toFixed(2) });
      }
    }

    res.status(200).json({ profits: profits, total_profit: totalProfit.toFixed(2) });
  } catch (error) {
    console.error('Error while calculating profit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProfitByMonth=async (req, res) => {
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
};

const getAllSales=async (req, res) => {
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
};

const getMonthwiseSales=async (req, res) => {
  const merchantId = req.params.merchant_id;

  try {
    const twelveMonthsSales = await Sales.aggregate([
      {
        $match: {
          merchant_id: merchantId
          // Add any other conditions if needed
        }
      },
      {
        $addFields: {
          parsedDate: {
            $dateFromString: {
              dateString: "$date_sold",
              format: "%m/%d/%Y" // Modify this format based on your date string format
            }
          }
        }
      },
      {
        $match: {
          parsedDate: {
            $gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1) // Sales from the last 12 months
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$parsedDate" }, // Extract month
            year: { $year: "$parsedDate" } // Extract year
          },
          totalSalesAmount: { $sum: "$total_selling_price" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
      }
    ]);

    res.json(twelveMonthsSales);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addSales, getMonthlySales, getSalesData,  getTotalSalesAmount, getTotalProfit, getProfitByDay, getProfitByMonth, getAllSales, getMonthwiseSales};
