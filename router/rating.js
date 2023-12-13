const express = require("express");
const router=express.Router();
const Supplier = require("../models/suppliers.js");
const Rating=require("../models/ratings.js");

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

router.post('/add_ratings_reviews', async (req, res) => {
    try {
        const { merchant_id, supplier_id, rating, review } = req.body;

        // const supplierInfoCollection = db.collection("suppliers");
        const supplierExists = await Supplier.findOne({ supplier_id: supplier_id });

        if (supplierExists) {
            // const supplierRatingCollection = db.collection("supplier_ratings");
            const filter = { merchant_id: merchant_id, supplier_id: supplier_id };
            const update = { $set: { ratings: rating, reviews: review } };
            const options = { upsert: true };

            const updatedSupplierRating = await Rating.updateOne(filter, update, options);

            // Calculate the average of ratings array elements at corresponding indexes
            const avgRatingsArray = await Rating.aggregate([
                { $match: { supplier_id: supplier_id } },
                {
                    $group: {
                        _id: null,
                        avg0: { $avg: { $arrayElemAt: ["$ratings", 0] } },
                        avg1: { $avg: { $arrayElemAt: ["$ratings", 1] } },
                        avg2: { $avg: { $arrayElemAt: ["$ratings", 2] } },
                        avg3: { $avg: { $arrayElemAt: ["$ratings", 3] } }
                    }
                }
            ]);

            // Update the ratings array in Suppliers collection
            const updatedRatings = avgRatingsArray[0] ? [avgRatingsArray[0].avg0, avgRatingsArray[0].avg1, avgRatingsArray[0].avg2, avgRatingsArray[0].avg3] : [];

            if (!supplierExists || !arraysEqual(supplierExists.rating, updatedRatings)) {
                const updateSupplier = await Supplier.updateOne(
                    { supplier_id: supplier_id },
                    { $set: { rating: updatedRatings } }
                );
                console.log(avgRatingsArray,updatedRatings,updateSupplier.modifiedCount);

                if (updateSupplier.modifiedCount > 0) {
                    res.json({ message: 'Ratings and reviews updated successfully' });
                } else {
                    res.json({ message: 'Failed to update ratings in Suppliers collection', updateSupplier });
                }
            } else {
                res.json({ message: 'Supplier ratings are the same, no update needed in Suppliers collection' });
            }
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (error) {
        console.error('Error while updating ratings and reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports=router;