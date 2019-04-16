var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    twitterRouter = require('../routes/tweet.server.routes.js'),
    cors = require(cors);

module.exports.init = function() {
    //connect to database
    mongoose.connect(config.db.uri, {useMongoClient: true});

    //initialize app
    var app = express();

    //enable request logging for development debugging
    app.use(morgan('dev'));

    //body parsing middleware
    app.use(bodyParser.json());

    app.use(cors());

    app.use('/', express.static(path.join(__dirname,'./../../client'))); //the argument for .static() might need changing

    app.use('/api/listings', listingsRouter);

    app.use('/api/twitter', tweetRouter);

    app.all('*', (req, res) => {
        res.redirect('/');
    });

    return app;
};  