const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    required: true
  },
  date_sold: {
    type: String,
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  selling_price_per_unit: {
    type: Number,
    required: true
  },
  total_selling_price: {
    type: Number,
    required: true
  },
  units_sold: {
    type: Number,
    required: true
  }
},
{timestamps:true}
);

const Sales = mongoose.model('customer_sales', SaleSchema);

module.exports = Sales;
