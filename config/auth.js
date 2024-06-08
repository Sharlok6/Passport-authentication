//Any route that needs to be protected from login in again after log out by method of
//reloading the page, it will prevent from happening
module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please log in to view this resource');
        res.redirect('/users/login');
    }
}