var express = require("express");
const User = require("../model/registered.model");
var router = express.Router();
const passport = require("passport");
const { body, validationResult } = require("express-validator");
let Recipe = require('../model/recipe');
const Admin = require("../model/admin");
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;


// Add the following line to use connect-flash middleware
router.use(flash());

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("home", { title: "COMP 231 - Group Project- Home Page" });
});

/* GET home page for admin */
router.get("/admin-home", async function (req, res, next) {
  res.render("admin-home", { title: "COMP 231 - Group Project- Home Page" });
});

/* GET post for admin */
router.get("/admin-post", async function (req, res, next) {
  res.render("admin-post", { title: "COMP 231 - Group Project- Home Page" });
});

router.get("/list_recipes", async function (req, res, next) {
  const orderBy = req.query.order_recipes || "desc";
  let recipeList = await Recipe.find().sort({ published : orderBy });
  const search = req.query.search;

  if (search) {
    const searchTerms = search.trim().toLowerCase().split(" ");
    recipeList = recipeList.filter((recipe) => {
      return searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term) || 
        recipe.ingredients.toLowerCase().includes(term)
      );
    });
  }
  
  res.render("list_recipes", { title: "List of Recipes", recipeList , search, orderBy});
});

router.get("/recipe/:id", async function (req, res, next) {
  const id = req.params.id;
  const recipe = await Recipe.findById(id);
  res.render("recipe_detail", { title: "Recipe Detail", recipe });
});

router.get("/admin-list_recipes", async function (req, res, next) {
  const orderBy = req.query.order_recipes || "desc";
  let recipeList = await Recipe.find().sort({ published : orderBy });
  const search = req.query.search;

  if (search) {
    const searchTerms = search.trim().toLowerCase().split(" ");
    recipeList = recipeList.filter((recipe) => {
      return searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term) || 
        recipe.ingredients.toLowerCase().includes(term)
      );
    });
  }
  
  res.render("admin-list_recipes", { title: "List of Recipes", recipeList , search, orderBy});
});

router.get("/admin-recipe/:id", async function (req, res, next) {
  const id = req.params.id;
  const recipe = await Recipe.findById(id);
  res.render("admin-recipe_detail", { title: "Recipe Detail", recipe });
});




/* GET top recipes*/ 
router.get("/recipe_detail", async function (req, res, next) {
  res.render("recipe_detail", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET top recipes */
router.get("/top_recipes", async function (req, res, next) {
    res.render("top_recipes", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET top recipes */
router.get("/admin-add_user", async function (req, res, next) {
  res.render("admin-add_user", { title: "COMP 231 - Assignment 1 - Top Recipes" });
});

/* GET contact */
router.get("/list_users", async function (req, res, next) {
  let userList = await User.find();
  res.render("list_users", { title: "List of Users", userList });
});



router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use('admin-local', new LocalStrategy(
  function(username, password, done) {
    Admin.findOne({ username: username }, function (err, admin) {
      if (err) { return done(err); }
      if (!admin) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (admin.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, admin);
    });
  }
));




router.get("/login", function (req, res, next) {
  if (req.user) return res.redirect("/");
  
  // Check if user is an admin
  if (req.query.admin === 'true') {
    req.session.returnTo = req.query.returnTo || req.headers.referer;
    res.render("admin-login", { title: "Admin Login", errorMsg: req.flash("error") });
  } else {
    req.session.returnTo = req.query.returnTo || req.headers.referer;
    res.render("login", { title: "COMP 231 - Assignment 1 - Login", errorMsg: req.flash("error") });
  }
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        return res.redirect(returnTo || "/");
      });
    } else {
      passport.authenticate("admin-local", function(err, admin, info) {
        if (err) {
          return next(err);
        }
        if (admin) {
          req.logIn(admin, function(err) {
            if (err) {
              return next(err);
            }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;

            // Save the admin as the current user
            req.user = admin;

            return res.redirect(returnTo || "/admin-home");
          });
        } else {
          req.flash("error", "Incorrect username or password.");
          return res.redirect("/");
        }
      })(req, res, next);
    }
  })(req, res, next);
});

// Display the form for updating a recipe
router.get('/update', async (req, res) => {
  const recipeId = req.query.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).send('Recipe not found');
    } else {
      res.render('update_recipes', { title: "Recipe update", recipe });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


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
  const id = req.body.id;
  Recipe.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/list_recipes');
    }
  });
});

// Display the form for updating a recipe
router.get('/updateadmin', async (req, res) => {
  const recipeId = req.query.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      res.status(404).send('Recipe not found');
    } else {
      res.render('admin-update_recipes', { title: "Recipe update", recipe });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Handle the POST request for updating a recipe
router.post('/admin-update/:id', async (req, res) => {
  const { title, description, ingredients } = req.body;
  const id = req.params.id;

  try {
    // Find the recipe by ID and update its properties
    const recipe = await Recipe.findByIdAndUpdate(id, { title, description, ingredients });
    // Redirect to the updated recipe's page
    res.redirect(`/admin-recipe/${id}`);
  } catch (error) {
    console.error(error);
    // Handle errors appropriately
    res.render('error');
  }
});


// Delete recipe
router.post('/admin-delete', (req, res) => {
  const id = req.body.id;
  Recipe.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/admin-list_recipes');
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

router.get('/updateUser', (req, res) => {
  const userId = req.query.userId;
  // use the userId to retrieve the user from the database
  User.findById(userId, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving user');
    } else {
      res.render('update_user', { title: "User update", user});
    }
  });
});

// POST /updateuser/:userId
router.post('/updateuser/:userId', async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
    res.redirect('/list_users'); // or wherever you want to redirect after the user is updated
  } catch (err) {
    console.error(err);
    res.render('error'); // or some other error handling mechanism
  }
});

router.get("/user/:id", async function (req, res, next) {
  const id = req.params.id;
  const user = await User.findById(id);
  res.render("user_detail", { title: "User Detail", user });
});

// Delete user
router.post('/deleteuser', (req, res) => {
  const id = req.body.userId;
  User.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    } else {
      res.redirect('/list_users');
    }
  });
});



module.exports = router;