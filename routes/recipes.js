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
router.get('/add', (req, res) => {
    res.render('recipes/add')
})

// Edit recipe page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(recipe.user != req.user.id){
            req.flash('error_msg', 'This is not your recipe');
            res.redirect('/recipes')
        } else {
            res.render('recipes/edit', {
                recipe: recipe
            })};
        });
    });
       
  

// Show recipe page
// router.get('/show', (req, res) => {
//     res.render('recipes/show')
// })



// Recipe Functionality ########################################

// Add recipe form submit
router.post('/add', (req, res) => {
    const newRecipe = {
        user: req.user.id,
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
router.put('/:id', (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        recipe.name = req.body.name;
        recipe.ingredients = req.body.ingredients

        recipe.name = req.body.recipeName,
        recipe.ingredients = {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        recipe.instructions = req.body.step
        recipe.save()
            .then(recipe => {
                req.flash('success_msg', 'Recipe updated');
                res.redirect('/recipes');
            })
      
    })
})


// Delete Recipe
router.delete('/:id', (req,res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(recipe.user != req.user.id){
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


// router.get('/:id', (req, rest) => {
//     User.findOneAndUpdate({
//         id: req.user.id 
//     }, {$push: {favorites: }})
// });


// Favorite Recipe
router.get('/:id', (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {

if(req.user.favorites.length>0){
console.log(recipe.id)

for(let i=0; i<req.user.favorites.length; i++){
    if(recipe.id == JSON.stringify(req.user.favorites[i]._id)) {
        req.flash('error_msg', 'Recipe already added to favorites');
        res.redirect('/recipes')
    } else {
        User.updateOne({_id: req.user.id}, {$push: {favorites: recipe}})
        .then(() => {
            req.flash('success_msg', 'Recipe added to favorites');
            res.redirect('/dashboard')
        })
        .catch(err => {
            console.log(err)
        })  
    }
}

} else {
    User.updateOne({_id: req.user.id}, {$push: {favorites: recipe}})
        .then(() => {
            req.flash('success_msg', 'Recipe added to favorites');
            res.redirect('/dashboard')
        })
        .catch(err => {
            console.log(err)
        })
}

        // if(req.params.id = JSON.stringify(req.user.favorites[0]._id)) {
        //     console.log('they are equal')
        // } else {
        //     console.log('they are not equal')
        // }



        // console.log(req.params.id = req.user.favorites[0].id)
        // console.log(typeof req.user.favorites[0]._id)

        // if(req.user.favorites.Object._id.contains(req.params.id)) {
        //     req.flash('error_msg', 'Recipe already added to favorites');
        //     res.redirect('/dashboard')
        // } else 
            // User.updateOne({_id: req.user.id}, {$push: {favorites: recipe}})
            // .then(() => {
            //     req.flash('success_msg', 'Recipe added to favorites');
            //     res.redirect('/dashboard')
            // })
            // .catch(err => {
            //     console.log(err)
            // })

    })
    
    
    

  
});



module.exports = router;