const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// base url
app.get("/", (req, res) => {
  res.render("index");
});

// register url
app.get("/register", (req, res) => {
  res.render("register");
});

// user created
app.post("/register", (req, res) => {
  try {
    res.send("user is created");
  } catch (error) {
    res.send(error.message);
  }
});

// login url
app.get("/login", (req, res) => {
  res.render("login");
});

// logout url
app.get("/logout", (req, res) => {
  res.redirect("/");
});

// profile protected url
app.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = app;
