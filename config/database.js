const mongoose = require("mongoose");
require("dotenv").config();

// mongodb connection
const dbURL = process.env.MONGODB_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.error(error.message);
  });
