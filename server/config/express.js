var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    session = require('express-session'),
    expressJwt = require('express-jwt'),
    listingsRouter = require('../routes/listings.server.routes');

module.exports.init = function() {
    //connect to database
    mongoose.connect(config.db.uri);

    //initialize app
    var app = express();

    //enable request logging for development debugging
    app.use(morgan('dev'));

    app.use("/", express.static('client'));

    //app.use('/api/listings', listingsRouter);

    //app.use('*/', function (req, res) {
    //    res.sendFile(path.resolve('client/index.html'));
    //});

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
    app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
    app.use('/login', require('./controllers/login.controller'));
    app.use('/register', require('./controllers/register.routes'));
    app.use('/app', require('./controllers/app.controller'));
    app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
    app.get('/', function (req, res) {
        return res.redirect('/app');
    });

    return app;
};  