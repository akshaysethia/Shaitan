const router = require('express').Router(); //if we want to be the prefix to be the user
const User = require('../models/user'); 

router.route('/signup')
    .get((req, res ,next) => { //get the input
        res.render('accounts/signup', {message: req.flash('errors') });
    })
    .post((req, res, next) => { //gets us the persons login details
        User.findOne({email: req.body.email }, function(err, existingUser) {
            if(existingUser) {
                req.flash('errors', 'Account With That Email Address Alreday Exists');
                res.redirect('/signup');
            } else {
                var user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.photo = user.gravatar();
                user.password = req.body.password;
                user.save(function(err) {
                    //req.logIn(user, function(err) {
                        if(err) return next(err);
                        res.redirect('/');
                    //});
                });
            }
        });
    });

    module.exports = router; //this helps us to join to the server.s page so as to export thses files 
