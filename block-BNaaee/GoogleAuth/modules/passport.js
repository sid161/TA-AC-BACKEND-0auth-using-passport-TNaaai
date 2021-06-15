var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = require('../models/User');


passport.use(new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:'/auth/github/callback'
},(accessToken,refreshToken,profile,done) => {
    var profileData = {
        name:profile.displayName,
        username:profile.username,
        email:profile._json.email,
        photo:profile._json.avatar_url,
    };

    console.log(profileData);
    User.findOne({email: profile._json.email},(err,user) => {
        if(err) return done(err);
        console.log(user,'i');
        if(!user){
            User.create(profileData,(err,addedUser) => {
                if(err) return done(err)
                return done(null,addedUser);
            })
        } else{
            console.log('hh');
            return done(null,user);
        }
    })
}))


passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID_GOOGLE,
    clientSecret:process.env.CLIENT_SECRET_GOOGLE,
    callbackURL:'/auth/google/callback'
},(accessToken,refreshToken,profile,done) => {
    console.log(profile)
    var profileData = {
        name:profile.displayName,
        username:profile.username,
        email:profile._json.email,
        photo:profile._json.avatar_url,
    }
    console.log(profileData)
    User.findOne({email:profile._json.email},(err,user) => {
        if(err) return next(err)
        console.log(user,"i");
        if(!user){
            User.create(profileData,(err,addedUser) => {
                if(err) return done(err);
                return done(null,addedUSer)

            })
        } else{
            console.log('google')
            return done(null,user);
        }
    })
}))

passport.serializeUser((user,done) => {
    done(null,user.id);
  })
  
  passport.deserializeUser(function (id,done) {
    User.findById(id,function(err,user) {
      done(err,user)
    })
  })