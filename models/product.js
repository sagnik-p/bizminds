const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  product_id: {
    type: String,
    required: true
  },
  product_info: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

const Product = mongoose.model('products', ProductSchema);

module.exports = Product;
