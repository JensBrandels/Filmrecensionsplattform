const express = require("express");
const { authenticateToken } = require("../middlewares/AuthMiddleware");
const { checkRole } = require("../middlewares/AuthRole");
const { Movie } = require("../models/movieModel");
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
  "/movies/:id",
  authenticateToken,
  checkRole(["admin", "user"]),
  async (req, res) => {
    try {
      const movieId = req.params.id;
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

module.exports = { movieRoute };
