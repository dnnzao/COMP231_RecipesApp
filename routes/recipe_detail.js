var express = require("express");

var router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Recipe = require('../model/recipe');


module.exports.displayRecipeDetail = (req, res, next) => {
    Recipe.find((err, recipeDetail) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(RecipeDetail);

            res.render('/recipe_detail', {title: 'Recipes', RecipeDetail: recipeDetail});      
        }
    });
}

module.exports.displayPostPage = (req, res, next) => {
    res.render('/post', {title: 'Post Recipe'})          
}

module.exports.processPostPage = (req, res, next) => {
    let newRecipe = Recipe({
        "title": req.body.title,
        "author": req.body.author,
        "published": req.body.published,
        "description": req.body.description,
        "ingredients": req.body.ingredients
    });

    Recipe.create(newRecipe, (err, Recipe) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the recipe list
            res.redirect('/list_recipes');
        }
    });

}

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    Recipe.findById(id, (err, recipeToEdit) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('/edit_recipeform.ejs', {title: 'Edit Recipe', recipe: recipeToEdit})
        }
    });
}

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id

    let updatedRecipe = Recipe({
        "_id": id,
        "title": req.body.title,
        "author": req.body.author,
        "published": req.body.published,
        "description": req.body.description,
        "ingredients": req.body.ingredients
    });

    Recipe.updateOne({_id: id}, updatedRecipe, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            // refresh the book list
            res.redirect('/list_recipes');
        }
    });
}

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Recipe.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the book list
             res.redirect('/list_recipes');
        }
    });
}
  