//This file holds any configuration variables we may need 
//'config.js' is typically ignored by git to protect sensitive information, such as your database's username and password

module.exports = {
  db: {
    uri: 'mongodb://dbadmin:password1@ds121455.mlab.com:21455/igniscyan_bootcamp_3', //spotData the URI of your mongo database here.
  }, 
  port: (process.env.PORT || 8080)
};
