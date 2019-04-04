var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    tweetRouter = require('../routes/tweet.server.routes.js'),
    cors = require(cors);

module.exports.init = function() {
    //connect to database
    mongoose.connect(config.db.uri);

    //initialize app
    var app = express();

    //enable request logging for development debugging
    app.use(morgan('dev'));

    //body parsing middleware
    app.use(bodyParser.json());

    app.use(cors());

    app.use("/", express.static('client')); //the argument for .static() might need changing

    app.use('/api/listings', listingsRouter);

    app.use('/api/twitter', tweetRouter);

    app.use('*/', function (req, res) {
        res.sendFile(path.resolve('client/index.html'));
    }); //this should take ambiguous routes to index.html

    return app;
};  