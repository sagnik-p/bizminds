const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    merchant_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }, 
    issue:{
        type: String,
        required: true,
    },
},
    { timestamps: true }
);

const Issue = mongoose.model("issues", IssueSchema);
module.exports = Issue;