let mongoose = require('mongoose');

let recipeModel = mongoose.Schema({
    title: String,
    author: String,
    published: Date,
    description: String,
    ingredients: String
},
{
    collection: "recipes"
});

module.exports = mongoose.model('Recipe', recipeModel);