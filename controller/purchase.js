const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");

// Add Purchase Details
const addPurchase = async (req, res) => {
  try {
    const {
      merchant_id,
      date_purchased,
      product_id,
      cost_price_per_unit,
      total_cost_price,
      units_purchased,
      supplier_id
    } = req.body;
    console.log("Request Body: ",req.body);

    const newPurchase = new Purchase({
      merchant_id,
      date_purchased,
      product_id,
      cost_price_per_unit,
      total_cost_price,
      units_purchased,
      supplier_id
    });

    // Save the new purchase data to the database
    const savedPurchase = await newPurchase.save();

    res.status(201).json({message:"Purchase added successfully!!",purchase:savedPurchase});
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({ error: 'Failed to add purchase data' });
  }
};

// Get Purchase Data of a Merchant
const getPurchaseData = async (req, res) => {
  try {
    const merchantID = req.params.merchantID;

    const purchaseData = await Purchase.find({ "merchant_id": merchantID }).lean();

    // Preprocess dates to make them sortable
    purchaseData.forEach(purchase => {
      const [month, day, year] = purchase.date_purchased.split('/');
      const dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      purchase.sortable_date = dateObj;
    });

    // Sort based on the preprocessed dates
    purchaseData.sort((a, b) => b.sortable_date - a.sortable_date);

    // Remove the temporary sortable_date field from the response
    purchaseData.forEach(purchase => delete purchase.sortable_date);

    res.json(purchaseData);
  } catch (error) {
    console.error('Error while fetching purchase data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get total purchase amount of a Merchant
const getTotalPurchaseAmount = async (req, res) => {
  try {
    let totalPurchaseAmount = 0;
    const purchaseData = await Purchase.find({ "merchant_id": req.params.merchantID });

    purchaseData.forEach((purchase) => {
      totalPurchaseAmount += purchase.total_cost_price;
    });

    res.json({ merchant_id:req.params.merchantID,TotalAmount:totalPurchaseAmount });
  } catch (error) {
    console.error('Error while calculating total purchase amount:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Get Purchase Data of Every Merchant in the system
const allPurchaseData=async (req, res) => {
  try {
      
      // Fetch all documents sorted by date_sold in descending order
      const sortedPurchases = await Purchase.find()
          .sort({ date_purchased: -1 }); // Sorting by date_sold in descending order

      res.json(sortedPurchases); // Return the sorted documents as a JSON response
  } catch (error) {
      console.error('Error while fetching Merchant Purchases:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const monthWisePurchase=async (req, res) => {
  try {
    const { merchant_id } = req.params;

    // Get the current date
    const currentDate = new Date();

    // Calculate the date 12 months ago from the current date
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // Find purchases within the last 12 months for the specified merchant_id
    const purchases = await Purchase.find({ merchant_id });

    const salesByMonth = Array.from({ length: 12 }, (_, index) => {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - index + 1, 0);

      const salesInMonth = purchases.reduce((totalSales, purchase) => {
        const purchaseDate = new Date(purchase.date_purchased);
        if (purchaseDate >= monthStart && purchaseDate <= monthEnd) {
          totalSales += purchase.total_cost_price; // Assuming 'total_cost_price' indicates the sale value
        }
        return totalSales;
      }, 0);

      // return {
      //   month: monthStart.toLocaleString('default', { month: 'long' }),
      //   year: monthStart.getFullYear(),
      //   totalPurchaseAmount: salesInMonth
      // };
      return salesInMonth;
    });

    res.status(200).json(salesByMonth);
  } catch (error) {
    console.error('Error while fetching sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount, allPurchaseData, monthWisePurchase };
