var Login = require('../models/login.server.model.js');

module.exports.register = function (req, res) {

    console.log('\nPerforming registration for: \n');
    console.log(req.body);

    res.setHeader('content-type', 'text/html');

    var user = new  Login();

    user.username = req.body.user;
    user.password = req.body.hpass;

    user.save(function(err) {

        if(err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            console.log('Registered');
            res.setHeader('content-type', 'text/html');
            res.status(200).send();
        }

    });

};

module.exports.validate = function (req, res) {

  console.log(req.body);

  res.setHeader('content-type', 'text/html');

  Login.findOne({username: req.body.user}, function (err, result) {
      if (err) {
          res.status(400).send(err)
      } else if (!result) {
          res.status(400).send()
          console.log('No object found');
      } else {

          if(result.equal(password)) { //Maybe need work here
              res.status(200).send();
              console.log('Success! Hash matches');
          } else {
              res.status(401).send();
              console.log('Checked hash, didn\'t match');
          }

      }
  });

};