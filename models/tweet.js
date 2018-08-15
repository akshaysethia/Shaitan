const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    owner: { type:Schema.Types.ObjectId, ref:'User'},
    content: String,
    created: { type: Date, default: date.now }
});

module.exports = mongoose.model('Tweet', TweetSchema);