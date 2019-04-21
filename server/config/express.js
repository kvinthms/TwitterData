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
  //connect to database
  mongoose.connect(config.db.uri,{useMongoClient: true});

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware 
  app.use(bodyParser.json());

  app.use(CORS());
  
  /**TODO
  Serve static files */
  app.use('/', express.static(path.join(__dirname,'./../../client')));
  /**TODO 
  Use the listings router for requests to the api */
  app.use('/api/listings',listingsRouter);

  app.use('/api/twitter', twitterRouter)

  /**TODO 
  Go to homepage for all routes not specified */ 
  app.all('*',(req,res)=>{
    res.redirect('/');
  });

  return app;
};  
