const express = require("express");
const { authenticateToken } = require("../middlewares/AuthMiddleware");
const { checkRole } = require("../middlewares/AuthRole");
const { Movie } = require("../models/movieModel");
const { Review } = require("../models/reviewModel");
const movieRoute = express.Router();

movieRoute.post(
  "/movies",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { title, director, releaseYear, genre } = req.body;

      const checkIfExists = await Movie.findOne({
        title: title,
        director: director,
        releaseYear: releaseYear,
        genre: genre,
      });

      if (checkIfExists) {
        return res
          .status(400)
          .send("This movie already exists within database!");
      }
      const movie = new Movie({
        title: title,
        director: director,
        releaseYear: releaseYear,
        genre: genre,
      });

      movie.save();
      res.status(200).send(movie);
    } catch (error) {
      res.status(400);
    }
  }
);

movieRoute.get(
  "/movies",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const allMovies = await Movie.find({});
      res.status(200).send(allMovies);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

movieRoute.get(
  "/movies/ratings",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const moviesWithRatings = await Movie.aggregate([
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "movieId",
            as: "reviews",
          },
        },
        {
          $unwind: {
            path: "$reviews",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            averageRating: { $avg: "$reviews.rating" },
            reviewCount: {
              $sum: { $cond: [{ $ifNull: ["$reviews", false] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            averageRating: { $ifNull: ["$averageRating", "No ratings yet"] },
            reviewCount: 1,
          },
        },
      ]);

      res.status(200).json(moviesWithRatings);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

movieRoute.get(
  "/movies/:id",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const movieId = req.params.id;

      const findMovieId = await Movie.findById(movieId);

      if (!findMovieId) {
        return res.status(400).send("Id is wrong");
      }

      const foundMovie = await Movie.findById(movieId);
      if (!foundMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.status(200).send(foundMovie);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

movieRoute.delete(
  "/movies/:id",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const movieId = req.params.id;

      const findMovieId = await Movie.findById(movieId);

      if (!findMovieId) {
        return res.status(400).send("Id is wrong");
      }

      const deleteMovie = await Movie.findByIdAndDelete(movieId);
      if (!deleteMovie) {
        return res.status(404).json({
          error: "Movie not found and could therefore not be deleted!",
        });
      }
      res
        .status(200)
        .send({ msg: "deleted movie successfully", deleted: deleteMovie });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

movieRoute.put(
  "/movies/:id",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const movieId = req.params.id;

      const findMovieId = await Movie.findById(movieId);

      if (!findMovieId) {
        return res.status(400).send("Id is wrong");
      }

      const { title, director, releaseYear, genre } = req.body;

      // Check if another movie with the same attributes exists
      const existingMovie = await Movie.findOne({
        _id: { $ne: movieId }, // Exclude the current movie
        title,
        director,
        releaseYear,
        genre,
      });

      if (existingMovie) {
        return res.status(400).json({
          error:
            "A movie with the same title, director, release year, and genre already exists.",
        });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        { title, director, releaseYear, genre },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedMovie) {
        return res.status(404).json({
          error: "Movie not found and could therefore not be updated!",
        });
      }

      res
        .status(200)
        .send({ msg: "Movie updated successfully!", update: updatedMovie });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

movieRoute.get(
  "/movies/:id/reviews",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const movieId = req.params.id;
      const findMovieId = await Movie.findById(movieId);

      if (!findMovieId) {
        return res.status(400).send("Id is wrong");
      }

      const foundMovie = await Movie.findById(movieId);
      if (!foundMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const foundReviewsForMovie = await Review.find({ movieId: movieId });
      if (foundReviewsForMovie.length === 0) {
        return res.status(200).json({
          movie: foundMovie,
          reviews: "This movie does not have any reviews yet!",
        });
      }
      const showMovieAndReviews = {
        movie: foundMovie,
        reviews: foundReviewsForMovie,
      };

      res.status(200).send(showMovieAndReviews);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = { movieRoute };
