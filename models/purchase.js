const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    required: true
  },
  date_purchased: {
    type: Date,
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  cost_price_per_unit: {
    type: Number,
    required: true
  },
  total_cost_price: {
    type: Number,
    required: true
  },
  units_purchased: {
    type: Number,
    required: true
  },
  supplier_id: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

const Purchase = mongoose.model('merchant_purchases', PurchaseSchema);

module.exports = Purchase;
