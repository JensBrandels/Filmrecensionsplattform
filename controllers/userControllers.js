const express = require("express");
const userRoute = express.Router();
const { hashPassword, comparePassword } = require("../bcrypt");
const { User } = require("../models/userModel");

userRoute.post("/register", async (req, res) => {
  try {
    const checkUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (checkUser) {
      return res
        .status(404)
        .send({ message: "username and email must be unique" });
    }
    const newUser = await new User(req.body);
    newUser.save();
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const checkUser = await User.findOne({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!checkUser) {
      res
        .status(400)
        .send(
          "That username, password or email is wrong, or user does not exist!"
        );

      //fortsätt här imorgon. Göra authentication och få fram token
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { userRoute };
