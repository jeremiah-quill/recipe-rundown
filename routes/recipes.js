const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// // Load Recipe Model
require('../models/Recipe');
const Recipe = mongoose.model('recipes');

// Load User Model
require('../models/User');
const User = mongoose.model('users');


// Routes ###################################################

// Public Recipes
router.get('/', (req, res) => {
    Recipe.find({})
    .sort({date:'desc'})
    .then(recipes => {
        res.render('recipes/index', {
            recipes: recipes
        })
    })
});
  
// Add recipe page
router.get('/add',  ensureAuthenticated, (req, res) => {
    res.render('recipes/add')
})

// Edit recipe page
// router.get('/edit/:id', ensureAuthenticated, (req, res) => {
//     Recipe.findOne({
//         _id: req.params.id
//     })
//     .then(recipe => {
//         if(recipe.user != req.user.id){
//             req.flash('error_msg', 'This is not your recipe');
//             res.redirect('/recipes')
//         } else {
//             res.render('recipes/edit', {
//                 recipe: recipe
//             })};
//         });
//     });
       
  

// Showcase recipe
router.get('/showcase/:name', (req, res) => {
    Recipe.findOne({
        name: req.params.name
    })
    .then(recipe => {
        res.render('recipes/showcase', {
            recipe: recipe
        })
    })
})




// Recipe Functionality ########################################

// Add recipe form submit
router.post('/add', (req, res) => {
    const newRecipe = {
        userId: req.user.id,
        username: req.user.username,
        name: req.body.recipeName,
        ingredients: {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        instructions: req.body.step
    }
    new Recipe(newRecipe)
    .save()
    .then(recipe => {
        req.flash('success_msg', 'Recipe added');
        res.redirect('/recipes')
    })
});



// Edit recipe form submit
// router.put('/:id', (req, res) => {
//     Recipe.findOne({
//         _id: req.params.id
//     })
//     .then(recipe => {
//         recipe.name = req.body.name;
//         recipe.ingredients = req.body.ingredients

//         recipe.name = req.body.recipeName,
//         recipe.ingredients = {
//             name: req.body.ingredient,
//             quantity: req.body.quantity,
//             measurement: req.body.measurement
//         },
//         recipe.instructions = req.body.step
//         recipe.save()
//             .then(recipe => {
//                 req.flash('success_msg', 'Recipe updated');
//                 res.redirect('/recipes');
//             })
      
//     })
// })

// Delete Recipe
router.delete('/:id', (req,res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(recipe.userId != req.user.id){
            req.flash('error_msg', 'This is not your recipe');
            res.redirect('/recipes')
        } else {
            Recipe.deleteOne({
                _id: req.params.id
            })
            .then(() => {
                req.flash('success_msg', 'Recipe removed');
                res.redirect('/recipes');
            })
        }
    })
})

// Favorite Recipe
router.get('/:id', (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(req.user.favorites.length>0){
            let match = 0;
            for(let i=0; i<req.user.favorites.length; i++){
                if(recipe.id == req.user.favorites[i]._id) {
                    match += 1
                }} 
            if(match > 0) {
                req.flash('error_msg', 'Recipe already added to favorites');
                res.redirect('/recipes')  
            } else {  
                User.updateOne({_id: req.user.id}, {$push: {favorites: recipe}})
                .then(() => {
                    req.flash('success_msg', 'Recipe added to favorites');
                    res.redirect('/recipes')
                })
            }
        } else {
            User.updateOne({_id: req.user.id}, {$push: {favorites: recipe}})
            .then(() => {
                req.flash('success_msg', 'Recipe added to favorites');
                res.redirect('/recipes') 
            })
        }
    })
});


// Unfavorite Recipe
router.get('/favorites/:id', (req,res) => {
    //THIS WORKS
    User.findOne({
        _id: req.user.id
    })
    .then(user => {
        for(let i=0; i<user.favorites.length; i++){
            if(user.favorites[i]._id == req.params.id){
                // let recipe = user.favorites[i];
                // console.log(recipe)
                User.updateOne({_id: req.user.id}, {$pull: {"favorites": user.favorites[i]}})
                .then(()=> {
   req.flash('success_msg', 'Entry removed from favorites')
        res.redirect('/favorites'); 
                })
            }
        }
    })



    
    .catch(err=> console.log(err))
})


    



module.exports = router;