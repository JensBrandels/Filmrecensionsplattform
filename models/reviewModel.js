const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId, //refer to movie by id
    ref: "Movie",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, //refer to user by id
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  requiredAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("review", reviewSchema);

module.exports = { Movie };
