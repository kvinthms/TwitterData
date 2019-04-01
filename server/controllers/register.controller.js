﻿var express = require('express'),
    router = express.Router(),
    request = require('request'),
    config = require('config.json');

router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) { //reload if there is an error
            return res.render('register', { error: 'Error' });
        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });
        }
        //logged in successfully
        return res.redirect('/login');
    });
});

module.exports = router;
