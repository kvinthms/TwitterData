var path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes');

module.exports.init = function() {
    //connect to database
    mongoose.connect(config.db.uri, {
		useMongoClient: true
	});

    //initialize app
    var app = express();

    //enable request logging for development debugging
    app.use(morgan('dev'));

	//body parsing middleware
	app.use(bodyParser.json());
    
	//Serve static files
	app.use(express.static('client'));

	//Use the trends router for requests to the API 
	app.use('/api/trends', trendsRouter); 

	//Use the Query router for requests to the API
	app.use('/api/search', queryRouter); 

	// User router
	app.use('/api/user', userRouter); 

	// If no route is given, set it to base '/'
	app.all('*', (req, res, next) => { 
		res.redirect('/'); 
		next();
	});

	return app; 


	
};  
