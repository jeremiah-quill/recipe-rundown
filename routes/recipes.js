const express = require('express');
const router = express.Router();

// // Load User Model
// require('../models/User');
// const User = mongoose.model('users');

// All recipes
router.get('/', (req, res) => {
    res.render('recipes/index')
    });

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




module.exports = router;