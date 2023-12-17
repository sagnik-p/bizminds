const mongoose = require('mongoose');

const CountersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    }
},{ timestamps: true }
);

const Counter = mongoose.model("counters", CountersSchema);
module.exports = Counter;