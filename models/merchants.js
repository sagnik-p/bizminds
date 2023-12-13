const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    merchant_id: {
        type: String,
        required: true,
    },
    shop_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    products_sold: {
        type: [{
            type: String
        }],
        required: false,
    }
    },  
    { timestamps: true }
);

const Merchant = mongoose.model("merchants", MerchantSchema);
module.exports = Merchant;