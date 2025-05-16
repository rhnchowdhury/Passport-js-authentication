const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const Users = require("./models/user.model");
require("./config/database");
require("dotenv").config();
require("./config/passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// express-session store in mongoDB
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "Sessions",
    }),
    // cookie: { secure: true },
  })
);

// passport js initialized
app.use(passport.initialize());
app.use(passport.session());

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

// login url: post
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

const checkLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// login url: get
app.get("/login", checkLogin, (req, res) => {
  res.render("login");
});

// logout url
app.get("/logout", (req, res) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    res.send(error.message);
  }
});

// profile protected url
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("profile");
  }
  res.redirect("/login");
});

module.exports = app;
