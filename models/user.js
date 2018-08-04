const mongoose = require('mongoose'); //mongoose libs that help us to create schemas
const Schema = mongoose.Schema; //to access schema we make local files

//this is a schema that is created schema is basically users 
const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    photo: String,
    tweets: [{
        tweet: {type: Schema.Types.ObjectId, ref: 'Tweet'}
    }]
});

module.exports = mongoose.model('User',UserSchema); //helps to export schemas so as to use it in different pages