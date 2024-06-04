const express = require("express");
const { authenticateToken } = require("../middlewares/AuthMiddleware");
const { checkRole } = require("../middlewares/AuthRole");
const { Review } = require("../models/reviewModel");
const reviewRoute = express.Router();

reviewRoute.post(
  "/reviews",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { movieId, rating, comment } = req.body;

      const review = new Review({
        movieId: movieId,
        userId: userId,
        rating: rating,
        comment: comment,
      });

      review.save();
      res.status(200).send(review);
    } catch (error) {
      res.status(400);
    }
  }
);

reviewRoute.get(
  "/reviews",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const allReviews = await Review.find({});
      res.status(200).send(allReviews);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

reviewRoute.get(
  "/reviews/:id",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const reviewId = req.params.id;

      const findReviewId = await Review.findById(reviewId);

      if (!findReviewId) {
        return res.status(400).send("Id is wrong");
      }

      const foundReview = await Review.findById(reviewId);
      if (!foundReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.status(200).send(foundReview);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

reviewRoute.delete(
  "/reviews/:id",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const reviewId = req.params.id;

      const findReviewId = await Review.findById(reviewId);

      if (!findReviewId) {
        return res.status(400).send("Id is wrong");
      }

      const deleteReview = await Review.findByIdAndDelete(reviewId);
      if (!deleteReview) {
        return res.status(404).json({
          error: "review not found and could therefore not be deleted!",
        });
      }
      res
        .status(200)
        .send({ msg: "deleted review successfully", deleted: deleteReview });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

reviewRoute.put(
  "/reviews/:id",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const reviewId = req.params.id;

      const findReviewId = await Review.findById(reviewId);

      if (!findReviewId) {
        return res.status(400).send("Id is wrong");
      }

      const { rating, comment } = req.body;

      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedReview) {
        return res.status(404).json({
          error: "Review not found and could therefore not be updated!",
        });
      }

      res
        .status(200)
        .send({ msg: "Review updated successfully!", update: updatedReview });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = { reviewRoute };
