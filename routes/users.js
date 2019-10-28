const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User login
router.get('/login', (req, res) => {
    res.render('users/login');
});
// User register
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('users/dashboard')
    // Idea.find({user: req.user.id})
    // .sort({date:'desc'})
    // .then(ideas => {
    //     res.render('users/dashboard', {
    //         ideas:ideas
    //     })
    // });
   
});

// Login form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// Register form POST
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password !== req.body.password2) {
        errors.push({text:'Passwords do not match'})
    }

    if(req.body.password.length < 4) {
        errors.push({text:'Password must be at least 4 characters'});
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({username: req.body.username})
            .then(user => {
                if(user) {
                    req.flash('error_msg','Username already registered');
                    res.redirect('/users/register')
                } else {
                        
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                new User(newUser)
                .save()
                .then(user => {
                 req.flash('success_msg', 'Account created');
                   res.redirect('/users/login');
              })
                .catch(err => {
                  console.log(err);
                   return
                });
            });
        });
                }
            })
    }
});

module.exports = router;