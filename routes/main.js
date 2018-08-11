const router = require('express').Router(); //sub url of the main url, behaves the same as the app instance
const User = require('../models/user'); //to create new users we need to create its variable , requires user schema

router.get('/', (req, res, next) => {
    if(req.user) {
        res.render('main/home');
    } else {
        res.render('main/landing'); //this is basically a get request and whatever comes to it it will respond with the landing page
    }
});

//this is used to create the new user
router.get('/create-new-user', (req, res ,next)=>{
    var user = new User();
    user.email = "balbalbachagaya@gmail.com"
    user.name = "Shree";
    user.password = "Hello";
    user.save(function(err) {
        if (err) return next(err);
        res.json("Successfully Created");
    });
});

module.exports = router; //exports this url so that server.js can use it properly