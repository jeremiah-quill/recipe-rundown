const express = require('express');
const router = express.Router();

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You have successfully logged out')
    res.redirect('/');
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





module.exports = router;