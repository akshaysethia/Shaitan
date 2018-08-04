const express = require('express'); //get,post,update,delete methords are made available by this methord
const morgan = require('morgan'); //lock requests
const bodyParser = require('body-parser'); //read data from front end
const mongoose = require('mongoose'); //lib for obj relation mapper - mongo db communicator
const hbs = require('hbs'); //temlating engine easy
const expressHbs = require('express-handlebars'); //extenstion to hbs
const config = require('./config/secret'); //this connects the main user database using the secret.js

const app = express(); //app instance of express library to construct urls

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

const  mainRoutes = require('./routes/main'); //requires a local file for the landing page

app.use(mainRoutes); //this makes the middle wire as the part of the previous line

app.listen(3030, (err) => {
    if(err)
        console.log(err);
    console.log(`Running on port ${3030}`);
});