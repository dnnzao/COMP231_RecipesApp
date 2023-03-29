var express = require("express");
const User = require("../model/registered.model");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
let Recipe = require('../model/recipe');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

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


router.get('/update', async (req, res, next) => {
  const id = req.query.userId;
  const recipe = await Recipe.findById(id);
  res.render('updaterecipes', { title: "Recipe Update", recipe });
});


/* GET top recipes*/ 
router.get("/recipe_detail", async function (req, res, next) {
  res.render("recipe_detail", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET top recipes */
router.get("/top_recipes", async function (req, res, next) {
    res.render("top_recipes", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});



/* GET contact */
router.get("/contact", async function (req, res, next) {
    res.render("contact", { title: "COMP 231 - Assignment 1 - Contact" });
});

var express = require("express");
const User = require("../model/registered.model");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
let Recipe = require('../model/recipe');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

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


router.get('/update', async (req, res, next) => {
  const id = req.query.userId;
  const recipe = await Recipe.findById(id);
  res.render('updaterecipes', { title: "Recipe Update", recipe });
});


/* GET top recipes*/ 
router.get("/recipe_detail", async function (req, res, next) {
  res.render("recipe_detail", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET top recipes */
router.get("/top_recipes", async function (req, res, next) {
    res.render("top_recipes", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});



/* GET contact */
router.get("/contact", async function (req, res, next) {
    res.render("contact", { title: "COMP 231 - Assignment 1 - Contact" });
});

/* POST for the Contact page
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
      return res.redirect('/');
    });
  })
);
*/

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.user) return res.redirect("/");
  req.session.returnTo = req.query.returnTo || req.headers.referer;
  res.render("login", { title: "COMP 231 - Assignment 1 - Login" });
});

/* POST login page. */
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    const returnTo = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(returnTo || "/");
  }
);



// Handle the POST request for updating a recipe
router.post('/update/:id', async (req, res) => {
  const { title, description, ingredients } = req.body;
  const id = req.params.id;

  try {
      // Find the recipe by ID and update its properties
      const recipe = await Recipe.findByIdAndUpdate(id, { title, description, ingredients });
      // Redirect to the updated recipe's page
      res.redirect(`/recipe/${id}`);
  } catch (error) {
      console.error(error);
      // Handle errors appropriately
      res.render('error');
  }
});

// Delete recipe
router.post('/delete', (req, res) => {
  const id = req.body.userId;
  Recipe.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/list_recipes');
    }
  });
});


router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;

/* GET login page. */
router.get("/login", function (req, res, next) {
  if (req.user) return res.redirect("/");
  req.session.returnTo = req.query.returnTo || req.headers.referer;
  res.render("login", { title: "COMP 231 - Assignment 1 - Login" });
});

/* POST login page. */
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    const returnTo = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(returnTo || "/");
  }
);



// Handle the POST request for updating a recipe
router.post('/update/:id', async (req, res) => {
  const { title, description, ingredients } = req.body;
  const id = req.params.id;

  try {
      // Find the recipe by ID and update its properties
      const recipe = await Recipe.findByIdAndUpdate(id, { title, description, ingredients });
      // Redirect to the updated recipe's page
      res.redirect(`/recipe/${id}`);
  } catch (error) {
      console.error(error);
      // Handle errors appropriately
      res.render('error');
  }
});

// Delete recipe
router.post('/delete', (req, res) => {
  const id = req.body.userId;
  Recipe.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/list_recipes');
    }
  });
});


router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;