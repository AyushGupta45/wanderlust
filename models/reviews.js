const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    defualt: Date.now(),
  },
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
