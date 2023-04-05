var mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  isAdmin: { type: Boolean, default: true }
},
{
  collection: "admin"
});


const Admin = mongoose.model("Admin", user_schema);

module.exports = Admin;