const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 348, height: 236.81, crop: "limit" }]
    });
    const parser = multer({ storage: storage });
    


// // Load Recipe Model
require('../models/Recipe');
const Recipe = mongoose.model('recipes');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Public Recipes route
router.get('/', (req, res) => {
    if(!req.user){
        Recipe.find({})
        .sort({date:'desc'})
        .then(recipes => {
            res.render('recipes/index', {
                recipes: recipes
            })
        })
    } else {
        User.findOne({
            _id: req.user.id
        })
        .populate('following')
        .then((user)=>{
            Recipe.find({})
            .sort({date:'desc'})
            .then(recipes => {
                res.render('recipes/index', {
                    recipes: recipes,
                    user: user
                })
            })
        })

    }
});
  
// Add recipe route
router.get('/add',  ensureAuthenticated, (req, res) => {
    res.render('recipes/add')
});

// Add recipe form submit
router.post('/add', parser.single("image"), (req, res) => {
if(!req.body.ingredient || !req.body.quantity || !req.body.measurement || !req.body.step ){
    req.flash('error_msg', 'Your recipe must include both a full ingredient and at least 1 step');
    res.redirect('/recipes/add')
} else {

  if(req.file){
    const newRecipe = {
        name: req.body.recipeName,
        userId: req.user.id,
        username: req.user.username,
        image: {
            url: req.file.url,
            // id: req.file.public_id
        },
        ingredients: {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        instructions: req.body.step
    }
    new Recipe(newRecipe)
    .save()
    .then(() => {
        req.flash('success_msg', 'Recipe added');
        res.redirect('/dashboard')
    })
  } else {
    const newRecipe = {
        name: req.body.recipeName,
        userId: req.user.id,
        username: req.user.username,
        // image: {
        //     url: '../public/placeholder.png',
        //     // id: req.file.public_id
        // },
        ingredients: {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        instructions: req.body.step
    }
    new Recipe(newRecipe)
    .save()
    .then(() => {
        req.flash('success_msg', 'Recipe added');
        res.redirect('/dashboard')
    })
  }
} 
});

// Edit recipe route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(recipe.userId != req.user.id){
            req.flash('error_msg', 'This is not your recipe');
            res.redirect('/recipes')
        } else {
            res.render('recipes/edit', {
                recipe: recipe
            })};
        });
    });

// Edit recipe form submit
router.put('/:id', parser.single("image"), (req, res) => {
    Recipe.findOne({
        _id: req.params.id
    })
    .then(recipe => {
        if(!req.body.ingredient || !req.body.quantity || !req.body.measurement || !req.body.step ){
            req.flash('error_msg', 'Your recipe must include both a full ingredient and at least 1 step');
            res.redirect('/dashboard')
        } else {

        if(!req.file){
        
        recipe.ingredients = {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        recipe.instructions = req.body.step
        recipe.save()
            .then(recipe => {
                req.flash('success_msg', 'Recipe updated');
                res.redirect('/dashboard');
            })
    } else {
       
        recipe.image = {
            url: req.file.url,
            // id: req.file.public_id
        },
        recipe.ingredients = {
            name: req.body.ingredient,
            quantity: req.body.quantity,
            measurement: req.body.measurement
        },
        recipe.instructions = req.body.step
        recipe.save()
            .then(recipe => {
                req.flash('success_msg', 'Recipe updated');
                res.redirect('/dashboard');
            })
    }

        }
}
    )
})
       
// Showcase recipe route
router.get('/showcase/:name', (req, res) => {
    Recipe.findOne({
        name: req.params.name
    })
    .then(recipe => {
        res.render('recipes/showcase', {
            recipe: recipe
        })
    })
});

// Showcase recipe from favorites route
router.get('/showcase2/:id', ensureAuthenticated, (req,res) => {
    User.findOne({
        _id: req.user.id
    })
    .populate('favorites.live')
    .then(
        user => {
        for(let i=0; i<user.favorites.length; i++){
            if(user.favorites[i].static._id == req.params.id){
                let recipe = user.favorites[i]
                res.render('recipes/showcase2', {
                    recipe:recipe
                })
            }
        }
    }
    )})

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
                res.redirect('/dashboard');
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
                if(recipe.id == req.user.favorites[i].live) {
                    match += 1
                }} 
            if(match > 0) {
                req.flash('error_msg', 'Recipe already added to favorites');
                res.redirect('/recipes')  
            } else {
                User.findOne({_id: req.user.id})
                .then(user => {
                    const newFavorite = {
                        static: recipe,
                        live: req.params.id
                    }
                    user.favorites.push(newFavorite);
                    user.save()
                })
                .then(() => {
                    req.flash('success_msg', 'Recipe added to favorites');
                    res.redirect('/favorites')
                })
            }
        } else {
            User.findOne({_id: req.user.id})
            .then(user => {
                const newFavorite = {
                    static: recipe,
                    live: req.params.id
                }
                user.favorites.push(newFavorite);
                user.save()
                .then(() => {
                    req.flash('success_msg', 'Recipe added to favorites');
                    res.redirect('/recipes')
                })
            })
      
        }
    })
});


// Unfavorite Recipe 
router.get('/favorites/:id', (req,res) => {
    User.findOne({
        _id: req.user.id
    })
    .then(user => {
        for(let i=0; i<user.favorites.length; i++){
            if(user.favorites[i].live == req.params.id){
                User.updateOne({_id: req.user.id}, {$pull: {"favorites": user.favorites[i]}})
                .then(()=> {
   req.flash('success_msg', 'Recipe removed from favorites')
        res.redirect('/favorites'); 
                })
            }
        }
    })
    .catch(err=> console.log(err))
})


    



module.exports = router;