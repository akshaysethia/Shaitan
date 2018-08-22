const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref:'User'}, //type of the owner , owner's ref is made
    content: String, //tweet content
    created: { type: Date, default: Date.now }  //date of tweet creation
});

module.exports = mongoose.model('Tweet', TweetSchema); 