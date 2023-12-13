const mongoose = require("mongoose");
const uri = process.env.MONGO_URL;

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Connected to MongoDB Atlas Succesfully!!")
    
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

module.exports = { main };