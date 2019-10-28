module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();        
        } 
        req.flash('error_msg', 'To access please login');
        res.redirect('/users/login');
    }
}
