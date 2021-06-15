var User = require('../models/User');

module.exports = {
    loggedInUser: (req,res,next) => {
        if(req.session && req.session.userId){
            next();
        } else{
            res.redirect('/users/login');
        }
    },
    userInfo: (req,res,next) => {
        var userpassport = req.session && req.session.passport;
        if(userpassport){
            var id = req.session.passport.user;
            User.findById(userId,(err,user) => {
                if(err) return next(err)
                req.user = user;
                res.locals.user = user;
                next();
        });
    
    } else {
        req.user= null;
        res.locals.user = null;
    }
}
}