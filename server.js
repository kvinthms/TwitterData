require('rootpath')();
var app_og = require('./server/config/app'),
    express = require('express'),
    app = express(),
    config = require('config.json'),
    config_og = require('./server/config/config'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    expressJwt = require('express-jwt');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
module.exports.start = function() {
    //var app_og = express.init();
    let port = process.env.PORT;
    if (port == null || port == "") {
        port = 8000;
    }
    app.listen(port, function() {
        console.log('App listening on port', config_og.port);
    });
};