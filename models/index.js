const mongoose = require("mongoose");
const uri = "mongodb+srv://sagnikpramanik95:LHEyHTCbO5oP5YSR@cluster0.lciunbh.mongodb.net/?retryWrites=true&w=majority";


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };