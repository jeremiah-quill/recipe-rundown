const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Landing page
router.get('/', (req, res) => {
    res.render('home')
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

// User login
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User register
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect: '/login',
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
    } 
    // console.log(req.body)
    else {
        User.findOne({username: req.body.username})
            .then(user => {
                if(user) {
                    req.flash('error_msg','Username already registered');
                    res.redirect('register')
                } 
                else {
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
                            res.redirect('dashboard');
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


// Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You have successfully logged out')
    res.redirect('/');
});



module.exports = router;