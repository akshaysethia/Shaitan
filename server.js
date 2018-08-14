const express = require('express'); //get,post,update,delete methords are made available by this methord
const morgan = require('morgan'); //lock requests
const bodyParser = require('body-parser'); //read data from front end
const mongoose = require('mongoose'); //lib for obj relation mapper - mongo db communicator
const hbs = require('hbs'); //temlating engine easy
const expressHbs = require('express-handlebars'); //extenstion to hbs
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //conect to the mongo store
const flash = require('express-flash'); //add the flash libraries , this is used to add error and user messages
const passport = require('passport'); //type of authenticator
const passportSocketIo = require('passport.socketio');
const cookieParser= require('cookie-parser'); //this lib is used by passport
const config = require('./config/secret'); //this connects the main user database using the secret.js

const app = express(); //app instance of express library to construct urls
const http = require('http').Server(app); //this is a way of making a object for the user and server helps to communicate between pages
const io = require('socket.io')(http); //connection b/w client soide and server side 

const sessionStore = new MongoStore({ url: config.database, autoReconnect: true })

mongoose.connect(config.database, function(err) {
    
    if (err) console.log(err);
    console.log("Connected to the Database");
},{ useNewUrlParser: true });

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' })); //extenstions to be handlebars 
app.set('view engine', 'hbs'); //set the sort of templating engine
app.use(express.static(__dirname + '/public')); //directory of the folder-to access static files
app.use(morgan('dev')); //used to lock all the requests
app.use(bodyParser.json()); //used to read json data types
app.use(bodyParser.urlencoded({ extended: true})); //to read all the unicode type of data
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret,
    store: sessionStore
}));// session can only remember for small amt of time and the mongo store is used to store the session in its memory
app.use(flash());
app.use(cookieParser()); //passport is both dependent on cookie and session
app.use(passport.initialize()); //here we initialize the passport strtegy
app.use(passport.session()); //similar to express-flash
app.use(function(req, res, next) {
    res.locals.user = req.user; //this helps us to access user in any page we want to 
    next();
})

io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'connect.sid,',
    secret: config.secret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
    console.log("Successful Connection");
    accept();
}

function onAuthorizeFail(data, accepmessage, error, accept) {
    console.log("Unsuccessful Connection");
    if (error) accept(new Error(message));
}

require('./realtime/io')(io); //if we are using the entire file (acts like a function)

//the tp thingy helps us to connect to the mongo store
const  mainRoutes = require('./routes/main'); //requires a local file for the landing page
const  userRoutes = require('./routes/user'); //requires a local file for the sign up page

app.use(mainRoutes); //this makes the middle wire as the part of the previous line
app.use(userRoutes); //this makes the middle wire part for the user file . helps in making the use of tht thingy

http.listen(3030, (err) => {
    if(err)
        console.log(err);
    console.log(`Running on port ${3030}`);
});
