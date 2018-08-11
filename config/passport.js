//passport does not know when do we have to save the session so we
//have to save this file and call it each and every time we require it
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser(function(user, done) { //in this part we store te users id in the session
    done(null, user.id);
});

passport.deserializeUser(function(id, done) { //retrive the stored id in the user session
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
 User.findOne({ email: email }, function(err, user) {
     if(err) return done(err);

     if(!user) return done(null, false, req.flash('loginMessage', 'U Are Not In My List'));

     if(!user.comparePassword(password)) return done(null, false, req.flash('loginMessage', 'Idiot.. Put The Correct Password'));

     return done(null, user);
 });
}));