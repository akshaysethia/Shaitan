const mongoose = require('mongoose'); //mongoose libs that help us to create schemas
const bcrypt = require('bcrypt-nodejs'); //calls the build in node js encrypter module for password
const crypto = require('crypto'); //this is for photo layer cryptography algorithm
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

//used to encrypt the password that is being stored in the data base
UserSchema.pre('save' ,function(next) {
    var user = this; //this is how we modify user schema in closure level
    if(!user.isModified('password')) return next();
    if(user.password) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next(err);
            bycrypt.hash(user.password, salt, null ,function(err, hash) {
                if(err) return next();
                user.password = hash;
                next(err);
            });
        });
    }
});

UserSchema.methods.gravatar = function(size) {
    if(!size) size = 200; //if the size of the pic is not set then by default it will be set to 200px
    if(!this.email) return 'https://gravatar.com/avatar/?s=${size}&d=retro'; //if email does not exist then return the pic via the given url
    const md5 = crypto.createHash('md5').update(this.email).digest('hex'); //if email exists we encrypt this email to the pic
    return 'https://gravatar.com/avatar/${md5}?s=${size}&d=retro'; //this specific email belongs to this photo
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); //this compares the user entered password with the stored data base password   
}


module.exports = mongoose.model('User',UserSchema); //helps to export schemas so as to use it in different pages