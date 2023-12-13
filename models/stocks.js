const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  products: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; // Ensures the array has at least one element
      },
      message: 'At least one product must be included in the stock.'
    }
  },
  quantity: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0; // Ensures the array has at least one element
      },
      message: 'At least one quantity must be provided for the products.'
    }
  }
},  { timestamps: true }
);

const Stock = mongoose.model('stocks', StockSchema);

module.exports = Stock;
