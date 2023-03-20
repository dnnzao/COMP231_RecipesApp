let mongoose = require('mongoose');

let recipeModel = mongoose.Schema({
    title: String,
    author: String,
    published: String,
    description: String,
    ingredients: String
},
{
    collection: "COMP231-recipes"
});

module.exports = mongoose.model('Recipe', recipeModel);