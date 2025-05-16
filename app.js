const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const Users = require("./models/user.model");
require("./config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
app.post("/register", async (req, res) => {
  try {
    const users = await Users.findOne({ email: req.body.email });
    if (users) {
      res.send("user already existed");
    } else {
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        const newUser = new Users({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        await newUser.save();
        res.redirect("/login");
      });
    }
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
