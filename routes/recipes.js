const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// // Load Recipe Model
require('../models/Recipe');
const Recipe = mongoose.model('recipes');




// All recipes
router.get('/', (req, res) => {
    Recipe.find({})
    .sort({date:'desc'})
    .then(recipes => {
        res.render('recipes/index', {
            recipes: recipes
        })
    })
})
  

// Add recipe
router.get('/add', (req, res) => {
    res.render('recipes/add')
})

// Edit recipe
router.get('/edit', (req, res) => {
    res.render('recipes/edit')
})

// Show recipe
router.get('/show', (req, res) => {
    res.render('recipes/show')
})

// Add recipe form
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
        res.redirect('/')
    })
})



module.exports = router;