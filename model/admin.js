var mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  
},
{
  collection: "admin"
});


const Admin = mongoose.model("Admin", user_schema);

module.exports = Admin;