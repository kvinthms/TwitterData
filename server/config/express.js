var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    listingsRouter = require('../routes/listings.server.routes'),
    twitterRouter = require('../routes/twitter.server.routes.js'),
    CORS = require('cors');

module.exports.init = function() {
  //Following old Bootcamp procedure, straightforward

  //Connect to DB
  mongoose.connect(config.db.uri,{useMongoClient: true});

  // Initialize the express app
  var app = express();

  // use morgan to log HTTP requests
  app.use(morgan('dev'));

  //Body parsing to make our jobs easier. 
  app.use(bodyParser.json());

  app.use(CORS());
  
  // Base route
  app.use('/', express.static(path.join(__dirname,'./../../client')));
  //Route listings
  app.use('/api/listings',listingsRouter);
  //Route twitter calls
  app.use('/api/twitter', twitterRouter)

  //Handle everything else 
  app.all('*',(req,res)=>{
    res.redirect('/');
  });

  return app;
};  
