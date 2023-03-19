var express = require("express");
const Assignment1 = require("../model/assigment1.model");
const User = require("../model/registered.model");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("home", { title: "COMP 231 - Assignment 1 - Home Page" });
});

/* GET list of recipes page. */
router.get("/list_recipes", function (req, res, next) {
  res.render("list_recipes", { title: "List of Recipes" });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.user) return res.redirect("/business");
  res.render("login", { title: "COMP 231 - Assignment 1 - Login" });
});

/* POST login page. */
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* POST for the Contact page*/
router.post(
  "/login/authenticate",
  passport.authenticate("local", {
    successRedirect: "/business",
    failureRedirect: "/login",
  })
);

/* GET business page. */
router.get("/business", async function (req, res, next) {
  if (!req.user) return res.redirect("/login");

  var contactList = await Assignment1.find();
  res.render("business_list", {
    title: "COMP 231 - Assignment 1 - Business Contact List",
    contactList: contactList.sort(function (a, b) {
      if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
        return -1;
      }
      if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
        return 1;
      }
      return 0;
    }),
  });
});

/* GET update page. */
router.get("/update", async function (req, res, next) {
  const userId = req.query.userId;
  const userFound = await Assignment1.findById(userId);

  res.render("update", {
    title: "COMP 231 - Assignment 1 - Update Contact List",
    userFound: userFound,
  });
});

/* POST for the Update page*/
router.post("/update/info", async function (req, res, next) {
  const userId = req.body.userId;
  const userFound = await Assignment1.findById(userId);

  console.log(userFound);
  console.log(userId);

  userFound.first_name = req.body.txtFirstName;
  userFound.last_name = req.body.txtLastName;
  userFound.phone = req.body.txtPhone;
  userFound.email = req.body.txtEmail;
  userFound.contact_input = req.body.txtSpecialRq;

  await userFound.save();

  res.redirect("/business");
});


module.exports = router;