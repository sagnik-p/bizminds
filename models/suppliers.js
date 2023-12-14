const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  supplier_id: {
    type:String,
    required:true
  },
  name: {
    type:String,
    required:true
  },
  shop_name: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:true
  },
  phone: {
    type:String,
    required:true
  },
  address: {
    type:String,
    required:true
  },
  products_sold: {
    type: [String],
    required: true, 
    validate: {
      validator: function(arr) {
        return arr.length > 0; 
      },
      message: 'At least one product must be sold.'
    }
  },
  product_prices: {
    type: [Number],
    required: true, 
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one product price must be provided.'
    }
  }, 
  rating: {
    type: [{
        type: Number
    }],
    required: false,
}, 
},
{ timestamps: true }
);

const Supplier = mongoose.model("suppliers", SupplierSchema);
module.exports = Supplier;
