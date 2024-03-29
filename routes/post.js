var express = require("express");
const Recipe = require("../model/recipe");
const passport = require("passport");

var router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../model/registered.model");

// Middleware function to set the author of the recipe to the username of the logged-in user
function setAuthor(req, res, next) {
  req.body.author = req.user.username;
  next();
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect user to login page if not authenticated
}

router.get("/", function (req, res, next) {
  res.render("post", {
    title: "COMP 231 - Assignment 1 - Add recipe",
    errors: []
  });
});

/* POST for the User Register page*/
router.post("/recipe_detail", isAuthenticated, [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title is minimum of 3 characters")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Description is minimum of 3 characters")
    .escape(),
  body("ingredients")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Ingredients is minimum of 3 characters")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("post", {
        recipe: req.body,
        errors: errors.array(),
        title: "COMP 231 - Assignment 1 - Update Fail",
      });
      return;
    }
    const { title, description, ingredients} = req.body;
    const published = Date.now();
    
    console.log(req.user.username + published);
    new Recipe({
      title,
      author: req.user.username,
      published,
      description,
      ingredients,
    }).save((err) => {
      if (err) return next(err);
      res.redirect("/list_recipes");
    });
  },
]);

module.exports = router;