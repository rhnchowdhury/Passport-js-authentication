const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("../models/user.model");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const users = await Users.findOne({ email: email });
      if (!users) {
        return done(null, false, { message: "incorrect email" });
      }
      if (!bcrypt.compare(password, users.password)) {
        return done(null, false, { message: "incorrect password" });
      }
      return done(null, users);
    } catch (error) {
      return done(err);
    }
  })
);

// create session ID
passport.serializeUser((users, done) => {
  done(null, users.id);
});

// finding session info using session ID

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
