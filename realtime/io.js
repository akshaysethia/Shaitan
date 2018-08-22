const async = require('async'); //used to save the tweets and data to the database
const Tweet = require('../models/tweet'); //to get the tweet
const User = require('../models/user'); //to get the user 
module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("Connected");
        var user = socket.request.user;
        console.log(user.name);

        socket.on('tweet', (data) => {
            console.log(data); //to show the tweet on cmd or console
            async.parallel({
                function(callback) {
                    io.emit('incomingTweets', { data, user });
                },
                function(callback) {
                    async.waterfall({
                        function(callback) {
                            var tweet = new Tweet();
                            tweet.content = data.content;
                            tweet.owner = user.id;
                            tweet.save(function(err) {
                                callback(err, tweet);
                            })
                        },
                        function(tweet, callback) {
                            User.update( {
                                _id: user.id
                            }, {
                                $push: {tweets: {tweet: tweet._id }},
                            }, function(err, count) {
                                callback(err, count);
                            }
                            );
                        }
                    });
                }
            });
        });
    });
}