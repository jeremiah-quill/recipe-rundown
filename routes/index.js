const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


// Load User Model
require('../models/User');
const User = mongoose.model('users');

// Load Recipe Model
require('../models/Recipe');
const Recipe = mongoose.model('recipes');

// Landing page route
router.get('/', (req, res) => {
    res.render('index/welcome')
    });

// Favorites route
router.get('/favorites', ensureAuthenticated, (req, res) => {
    User.findOne({
        _id: req.user.id
    })
    .populate('favorites.live')
    .populate('following')
    .then(user => {
        res.render('index/favorites', {
            user: user
        })
    })
});

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Recipe.find({userId: req.user.id})
    .then(recipe => {
        User.findOne({
            _id: req.user.id
        })
    .populate('following')
    .populate('followers')
    .then(user => {
        res.render('index/dashboard', {
            user:user,
            recipe:recipe
        })
    })
    })})

// Profile route
router.get('/profile/:id', (req, res) => {
    if(!req.user){
    Recipe.find({
        userId: req.params.id
    })
    .populate('user')
    .then(recipe => {
        User.findOne({_id: req.params.id})
        .then(profile => {
        res.render('index/profile', {
            recipe: recipe,
            profile: profile
        })
    })
    })
} else {
    User.findOne({
        _id: req.user.id
    })
    .populate('following')
    .then(user => {
        Recipe.find({
            userId: req.params.id
        })
        .populate('user')
        .then(recipe => {
            User.findOne({_id: req.params.id})
            .then(profile => {
            res.render('index/profile', {
                recipe: recipe,
                profile: profile,
                user: user
            })
        })
        })
    })

}
})

// My cookbook route
router.get('/cookbook', ensureAuthenticated, (req, res) => {
    Recipe.find({userId: req.user.id})
    .sort({date:'desc'})
    .then(recipes => {
        res.render('recipes/index', {
            recipes:recipes
        })
    })
});
  
// Login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Register route
router.get('/register', (req, res) => {
    res.render('users/register');
});


function usernameToLowerCase(req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}



// Login Post
router.post('/login', usernameToLowerCase, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
})





// Register Post
router.post('/register', usernameToLowerCase, (req, res) => {
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
                            res.redirect('login');
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

// Follow user WORKS
// router.get('/follow/:id', function(req, res){
//     const id = new mongoose.Types.ObjectId(req.params.id)
//     User.updateOne({
//         _id: req.user.id
//     },{
//                 $addToSet: { following: id }
//             }  )

// .then(()=> res.redirect('/recipes'))
// .catch(err => console.log(err))
// })

// Follow user
router.get('/follow/:id', ensureAuthenticated, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id)
        if (req.user.id === req.params.id) {
            req.flash('error_msg', "Sorry, you can't follow yourself")
            res.redirect('/recipes')
        } else if (req.user.following.includes(req.params.id)){
            req.flash('error_msg', "You are already following this user")
            res.redirect('/recipes')
        } else {
            const query = {
                _id: req.user.id,
                following: { $not: { $elemMatch: { $eq: id } } }
            }
            const update = {
                $addToSet: { following: id }
            }
            const updated = await User.updateOne(query, update)
            const secondQuery = {
                _id: id,
                followers: { $not: { $elemMatch: { $eq: req.user.id } } }
            }
            const secondUpdate = {
                $addToSet: { followers: req.user.id }
            }
            const secondUpdated = await User.updateOne(secondQuery, secondUpdate)
            req.flash('success_msg', 'Added to followers');
            res.redirect('/recipes');
            }
})

// //UNFOLLOW
router.get('/unfollow/:id', ensureAuthenticated, async (req, res) => {
    const {id} = req.params
    // if (req.user.id === req.params.id) {
    //     req.flash('error_msg', "Sorry, you can't follow yourself")
    //     res.redirect('/recipes')
    // } else if (req.user.following.includes(req.params.id)){
    //     req.flash('error_msg', "You are already following this user")
    //     res.redirect('/recipes')
    // } else {
        const query = {
            _id: req.user.id,
            following: { $not: { $elemMatch: { $eq: id } } }
        }
        const update = {
            $pull: { following: id }
        }
        const updated = await User.updateOne(query, update)
        const secondQuery = {
            _id: id,
            followers: { $not: { $elemMatch: { $eq: req.user.id } } }
        }
        const secondUpdate = {
            $pull: { followers: req.user.id }
        }
        const secondUpdated = await User.updateOne(secondQuery, secondUpdate)
        req.flash('success_msg', 'Removed to followers');
        res.redirect('/recipes');
        // }
//     try {
//         const { id } = req.params

//         // check if the id is a valid one
//         if (!ObjectID.isValid(id)) {
//             return res.status(404).json({ error: 'Invalid ID' })
//         }

//         // check if your id doesn't match the id of the user you want to unfollow
//         if (res.user._id === id) {
//             return res.status(400).json({ error: 'You cannot unfollow yourself' })
//         }

//         // remove the id of the user you want to unfollow from following array
//         const query = {
//             _id: res.user._id,
//             following: { $elemMatch: { $eq: id } }
//         }

//         const update = {
//             $pull: { following: id }
//         }

//         const updated = await User.updateOne(query, update)

//         // remove your id from the followers array of the user you want to unfollow
//         const secondQuery = {
//             _id: id,
//             followers: { $elemMatch: { $eq: res.user._id } }
//         }

//         const secondUpdate = {
//             $pull: { followers: res.user._id }
//         }

//         const secondUpdated = await User.updateOne(secondQuery, secondUpdate)

//         if (!updated || !secondUpdated) {
//             return res.status(404).json({ error: 'Unable to unfollow that user' })
//         }

//         res.status(200).json(update)
//     } catch (err) {
//         res.status(400).send({ error: err.message })
//     }
})

// Logout
router.get('/logout', function(req, res){
    req.logout();
    // req.flash('success_msg', 'You have successfully logged out')
    res.redirect('/');
});




module.exports = router;