var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var routes= require('./routes/index.js');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var cors = require('cors');
mongoose.connect('mongodb://localhost/aadhar');
var db = mongoose.connection;
console.log('DB connected');

//init app
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// Global Vars
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use('/', routes);

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
    console.log('Server started on port '+app.get('port'));
});