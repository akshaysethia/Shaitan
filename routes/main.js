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
                    var follower = user.followers.some(function(friend) {
                        return friend.equal(req.user._id);
                    });
                    var currentuser;
                    if (req.user._id.equals(user.id)) {
                        currentUser = true;
                    } else {
                        currentUser = false;
                    }
                    res.render('main/user', { foundUser: user, tweets: tweets, currentUser: currentUser, follower: follower });
                });
        }
    ]);
});

router.post('/follow/:id', (req, res, next) => {
    async.parallel([
        function(callback) {
            User.update(
                {
                    _id: req.user._id,
                    following: { $ne: req.params.id }
                },
                {
                    $push: {following: req.params.id }
                }, function(err, count) {
                    callabck(err, count);
                }
            )
        },
        function(callback) {
            User.update(
                {
                    _id: req.params._id,
                    followers: { $ne: req.user._id }
                },
                {
                    $push: {followers: req.user._id }
                }, function(err, count) {
                    callabck(err, count);
                }
            )
        }
    ], function(err, results) {
        if (err) return next(err);
        res.json("Success");
    });
});

router.post('/unfollow/:id', (req, res, next) => {
    async.parallel([
        function(callback) {
            User.update(
                {
                    _id: req.user._id,
                },
                {
                    $pull: {following: req.params.id }
                }, function(err, count) {
                    callabck(err, count);
                }
            )
        },
        function(callback) {
            User.update(
                {
                    _id: req.params._id,
                },
                {
                    $pull: {followers: req.user._id }
                }, function(err, count) {
                    callabck(err, count);
                }
            )
        }
    ], function(err, results) {
        if (err) return next(err);
        res.json("Success");
    });
});

module.exports = router; //exports this url so that server.js can use it properly