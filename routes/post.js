var express = require("express");
const Recipe = require("../model/recipe");
var router = express.Router();
const { body, validationResult } = require("express-validator");

router.get("/", function (req, res, next) {
  res.render("post", {
    title: "COMP 231 - Assignment 1 - Add recipe",
  });
});

/* POST for the User Register page*/
router.post("/recipedetail", [
  body("title")
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("Title up to 100 characters only")
    .escape(),
  body("author")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Author up to 100 characters only")
    .escape(),
  body("published")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Publish up to 20 characters only")
    .escape(),
   body("description")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("up to 100 characters only")
    .escape(),
   body("ingredients")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("up to 100 characters only")
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("post", {
        recipe: req.body,
        errors: errors.array(),
        title: "COMP 231 - Assignment 1 - Post Fail",
      });
      return;
    }
    const { title, author, published, description, ingredients } = req.body;
    new Recipe({
      title,
      author,
      published,
      description,
      ingredients,
    }).save((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  },
]);




module.exports = router;