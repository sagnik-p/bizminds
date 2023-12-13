const mongoose = require("mongoose");
const uri = "mongodb+srv://bizminds:vVqmvCxpSI8fyerd@cluster0.mojhc2a.mongodb.net/db0?retryWrites=true&w=majority";

function main() {
    mongoose.connect(uri).then(() => {
        console.log("Connected to MongoDB Atlas Succesfully!!")
    
    }).catch((err) => {
        console.log("Error: ", err);
    })
}

module.exports = { main };