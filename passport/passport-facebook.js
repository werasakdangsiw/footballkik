'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
     clientID: secret.facebook.clientID,
     clientSecret: secret.facebook.clientSecret,
     //clientID: process.env.FB_CLIENT_ID,
     //clientSecret: process.env.FB_CLIENT_SECRET,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
    
}, (req, token, refreshToken, profile, done) => {
    
    User.findOne({facebook:profile.id}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            return done(null, user);
        }else{
            const newUser1 = new User();
            newUser1.facebook = profile.id;
            newUser1.fullname = profile.displayName;
            newUser1.username = profile.displayName;
            newUser1.email = profile._json.email;
            newUser1.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser1.fbTokens.push({token:token});
            
            newUser1.save((err) => {
                return done(null, newUser1);
            })
        }
    })
}));































