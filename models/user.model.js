const mongoose = require("mongoose");

// schema created
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// model created
const Users = mongoose.model("passportAuth", userSchema);

module.exports = Users;
