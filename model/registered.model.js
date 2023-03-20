var mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
},
{
  collection: "users"
});

const User = mongoose.model("User", user_schema);

module.exports = User;
