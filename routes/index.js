var express = require("express");
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
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

module.exports = router;