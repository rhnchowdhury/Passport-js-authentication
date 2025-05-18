const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("../models/user.model");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (name, password, done) => {
    try {
      const users = await Users.findOne({ name: name });
      if (!users) {
        return done(null, false, { message: "incorrect name" });
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
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// finding session info using session ID

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
