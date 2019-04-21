//This file holds any configuration variables we may need 
//'config.js' is typically ignored by git to protect sensitive information, such as your database's username and password

module.exports = {
  db: {
    uri: 'mongodb://root:rootpass1@ds127655.mlab.com:27655/bootcamp4', //place the URI of your mongo database here.
  }, 
  port: (process.env.PORT || 8080)
};
