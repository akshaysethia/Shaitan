const router = require('express').Router(); //sub url of the main url, behaves the same as the app instance

router.get('/', (req, res, next) => {
    res.render('main/landing'); //this is basically a get request and whatever comes to it it will respond with the landing page
});

module.exports = router; //exports this url so that server.js can use it properly