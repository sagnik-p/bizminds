const express = require("express");
const router=express.Router();
const Supplier = require("../models/suppliers.js");
const Rating=require("../models/ratings.js");
const rating=require("../controller/rating.js");

//Add Supplier Rating
// {
//     "merchant_id":"m1",
//     "supplier_id":"s1",
//     "rating":[10,6,8,9],
//     "review":"Good Service!!"
// }
router.post('/add_ratings_reviews', rating.add_ratings_reviews);

module.exports=router;