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
      const userId = req.user.id;
      const userRole = req.user.role;

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

module.exports = { movieRoute };
