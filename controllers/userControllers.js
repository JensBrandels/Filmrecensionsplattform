const express = require("express");
const userRoute = express.Router();
const { hashPassword, comparePassword } = require("../bcrypt");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");

userRoute.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (checkUser) {
      return res
        .status(404)
        .send({ message: "username and email must be unique" });
    }

    //hashar lösen här
    const hashedpassword = await hashPassword(password);
    const newUser = new User({
      username: username,
      email: email,
      password: hashedpassword,
      role: role,
    });
    newUser.save();
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkUser = await User.findOne({
      username: username,
      email: email,
    });

    if (!checkUser) {
      res
        .status(400)
        .send("That username or email is wrong, or user does not exist!");
    }

    const isPasswordMatching = await comparePassword(
      password,
      checkUser.password
    );
    if (isPasswordMatching) {
      const token = jwt.sign(
        {
          id: checkUser._id,
          username: checkUser.username,
          role: checkUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      let result = {
        token: token,
      };
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { userRoute };
