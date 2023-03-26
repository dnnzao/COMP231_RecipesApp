var express = require("express");
const User = require("../model/registered.model");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
let Recipe = require('../model/recipe');

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("home", { title: "COMP 231 - Assignment 1 - Home Page" });
});

/* GET list of recipes page. */
router.get("/list_recipes", async function (req, res, next) {
  let recipeList = await Recipe.find();
  const search = req.query.search;

  if (search) {
    recipeList = recipeList.filter((recipe) => {
      return recipe.ingredients.includes(search);
    }) 
  }
  res.render("list_recipes", { title: "List of Recipes" , recipeList })
});

router.get("/recipe/:id", async function (req, res, next) {
  const id = req.params.id;
  const recipe = await Recipe.findById(id);
  res.render("recipe_detail", { title: "Recipe Detail", recipe });
});

/* GET top recipes */
router.get("/top_recipes", async function (req, res, next) {
    res.render("top_recipes", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET post */
router.get("/post", async function (req, res, next) {
    res.render("post", { title: "COMP 231 - Assignment 1 - Post" });
});

/* GET contact */
router.get("/contact", async function (req, res, next) {
    res.render("contact", { title: "COMP 231 - Assignment 1 - Contact" });
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.user) return res.redirect("/");
  res.render("login", { title: "COMP 231 - Assignment 1 - Login" });
});

/* POST login page. */
router.post("/login", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/* POST for the Contact page*/
router.post(
  "/login",
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('loginMessage', 'Authentication Error');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/contact-list');
    });
  })
);

module.exports = router;