const express = require("express");
const mongoose = require("mongoose");
const { userRoute } = require("./controllers/userControllers");
const { movieRoute } = require("./controllers/movieControllers");
const { reviewRoute } = require("./controllers/reviewControllers");
require("dotenv").config();
const app = express();
app.use(express.json());

//here goes routes
app.use("/", userRoute);
app.use("/", movieRoute);
app.use("/", reviewRoute);

const mongoURI = process.env.DB_URI;

mongoose.connect(mongoURI);

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on PORT: ${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});
