const mongoose = require('mongoose');

const OperationsSchema = new mongoose.Schema({
    merchant_id: {
        type: String,
        required: true,
    },
    backlog: {
        type: [{
            operation_id:{
                type:String,
                required:true
            },
            product:{
                type:String,
                required:true
            },
            supplier:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                required:true
            }
        }],
        required: false,
    },
    placed: {
        type: [{
            operation_id:{
                type:String,
                required:true
            },
            product:{
                type:String,
                required:true
            },
            supplier:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                required:true
            }
        }],
        required: false,
    },
    delivered: {
        type: [{
            operation_id:{
                type:String,
                required:true
            },
            product:{
                type:String,
                required:true
            },
            supplier:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                required:true
            }
        }],
        required: false,
    },
    cancelled: {
        type: [{
            operation_id:{
                type:String,
                required:true
            },
            product:{
                type:String,
                required:true
            },
            supplier:{
                type:String,
                required:true
            },
            quantity:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                required:true
            }
        }],
        required: false,
    }
    },  
    { timestamps: true }
);

const Operation = mongoose.model("operations", OperationsSchema);
module.exports = Operation;