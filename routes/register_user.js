var express = require("express");
const User = require("../model/registered.model");
var router = express.Router();
const { body, validationResult } = require("express-validator");

router.get("/", function (req, res, next) {
  res.render("register_user", {
    title: "COMP 231 - Assignment 1 - Register User",
    errors: []
  });
});


/* POST for the User Register page*/
router.post("/info", [
  body("username")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Username should have 4 to 20 characters")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Password should have 3 to 20 characters")
    .escape(),
  body("email", "Email is invalid").isEmail().normalizeEmail(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("register_user", {
        user: req.body,
        errors: errors.array(),
        title: "COMP 231 - Assignment 1 - Register Fail",
    
      });
      return;
    }
    const { username, password, email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) {
        res.render("register_user", {
          user: req.body,
          errors: [{ msg: "Email already exists" }],
          title: "COMP 231 - Assignment 1 - Register Fail",

        });
        return;
      }

      // Check if a user with the same username already exists
      const usernameUser = await User.findOne({ username });
      if (usernameUser) {
        res.render("register_user", {
          user: req.body,
          errors: [{ msg: "Username already exists" }],
          title: "COMP 231 - Assignment 1 - Register Fail",
        });
        return;
      }
      
      new User({
        username,
        password,
        email,
      }).save((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
});

module.exports = router;
