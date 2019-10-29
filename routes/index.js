const express = require('express');
const router = express.Router();

  // Landing page
app.get('/', (req, res) => {
    res.render('home')
    });

// Dashboard route
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard')
    // Idea.find({user: req.user.id})
    // .sort({date:'desc'})
    // .then(ideas => {
    //     res.render('users/dashboard', {
    //         ideas:ideas
    //     })
    // });
});


module.exports = router;