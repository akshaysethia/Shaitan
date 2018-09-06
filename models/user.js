const mongoose = require('mongoose'); //mongoose libs that help us to create schemas
const bcrypt = require('bcrypt-nodejs'); //calls the build in node js encrypter module for password
const crypto = require('crypto'); //this is for photo layer cryptography algorithm
const Schema = mongoose.Schema; //to access schema we make local files
const mongooseAlgolia = require('mongoose-algolia');

//this is a schema that is created schema is basically users 
const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    photo: String,
    tweets: [{
        tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' }
    }],
    following: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
});

//used to encrypt the password that is being stored in the data base
UserSchema.pre('save' ,function(next) {
    var user = this; //this is how we modify user schema in closure level
    if(!user.isModified('password')) return next();
    if(user.password) {
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, null ,function(err, hash) {
                if(err) return next();
                user.password = hash;
                next(err);
            });
        });
    }
});

UserSchema.methods.gravatar = function(size) {
    if(!size) size = 100; //if the size of the pic is not set then by default it will be set to 100px
    if(!this.email) return `https://s.gravatar.com/avatar/?s=${size}&r=pg&d=retro`; //if email does not exist then return the pic via the given url
    const md5 = crypto.createHash('md5').update(this.email).digest("hex"); //if email exists we encrypt this email to the pic
    return `https://s.gravatar.com/avatar/${md5}?s=${size}&r=pg&d=retro`; //this specific email belongs to this photo
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); //this compares the user entered password with the stored data base password   
}

UserSchema.plugin(mongooseAlgolia,{
    appId: 'V15HLPY42G',
    apiKey: '1713673876779c1b651a592c6529da0c',
    indexName: 'UserSchema', //The name of the index in Algolia, you can also pass in a function
    selector: 'email name tweets', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
    populate: {
      path: '',
      select: 'name'
    },
    defaults: {
      author: 'unknown'
    },
    mappings: {
      title: function(value) {
        return `${value}`
      }
    },
    debug: true // Default: false -> If true operations are logged out in your console
  });
  
  
  let Model = mongoose.model('User', UserSchema);
  
  Model.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
  Model.SetAlgoliaSettings({
    searchableAttributes: ['name','email'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
  });


module.exports = Model; //helps to export schemas so as to use it in different pages