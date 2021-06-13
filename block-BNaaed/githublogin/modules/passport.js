var passport = require('passport');
var User = require('../models/User');

var GithubStrategy = require('passport-github').Strategy

passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:"/auth/github/callback"
}, (accessToken,refreshToken,profile,done) => {
    console.log(profile);
    var profileData = {
        name:profile.displayName,
        username:profile.username,
        email:profile._json.email,
        photo:profile._json.avatar_url
    }
    User.findOne({email:profile._json.email},(err,user) => {
        if(err) return done(err);
        if(!user){
            User.create(profileData,(err,addedUser))
            if(err) return next(err)
            return done(null,addedUser)
        }
    })
    return done(null,user);
}))

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    User.findById(id,function(err,user){
        done(err,user);
    })
})