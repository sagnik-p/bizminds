const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  merchant_id: {
    type: String,
    required: true
  },
  supplier_id: {
    type: String,
    required: true
  },
  ratings: {
    type: [Number],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 4; // Ensures the array has at least one element
      },
      message: 'Ratings array should contain exactly 4 elements.'
    }
  },
  reviews: {
    type: String,
    required: true
  }
},
{ timestamps: true }
);

const Rating = mongoose.model('supplier_ratings', RatingSchema);

module.exports = Rating;
