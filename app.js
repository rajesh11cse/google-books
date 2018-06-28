'use strict'

var express = require("express"),
    bodyParser = require('body-parser'),
    app = express(),
    passport = require('passport'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    config = require('./config/database_dev.js');

// =========== middleware ======================
// Initial the the passport 
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(logger('dev'));

// connect to Mongo when the app initializes
mongoose.connect(config.db); // connect to mongo database

// routes =========================================================
var routes = require("./routes.js")(app, passport);

require('./config/passport.js')(passport);

// Run server at port 3000
var server = app.listen(3000, function () {
    console.log('Server listening at port : %s', server.address().port);
});
