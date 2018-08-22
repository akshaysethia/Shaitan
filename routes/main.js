const router = require('express').Router(); //sub url of the main url, behaves the same as the app instance
const User = require('../models/user'); //to create new users we need to create its variable , requires user schema
const Tweet = require("../models/tweet");
const async = require('async');

router.get('/', (req, res, next) => {
    if(req.user) {
        Tweet.find({})
            .sort('-created')
            .populate('owner')
            .exec(function(err, tweets) {
            if(err) return next(err);
            console.log(tweets);
            res.render('main/home', { tweets: tweets });
        });
    } else {
        res.render('main/landing'); //this is basically a get request and whatever comes to it it will respond with the landing page
    }
});

router.get('/user/:id', (req, res, next) => {
    async.waterfall([
        function(callback) {
            Tweet.find({ owner: req.params.id })
                .populate('owner')
                .exec(function(err, tweets) {
                    callback(err, tweets);
                });
        },
        function(tweets, callback) {
            User.findOne({ _id: req.params.id })
                .populate('following')
                .populate('followers')
                .exec(function(err, user) {
                    res.render('main/user', { foundUser: user, tweets: tweets });
                });
        }
    ]);
});

module.exports = router; //exports this url so that server.js can use it properly