const request = require('request');
const config = require('./config.js');



//Running a GET script to get the Bearer Token (Since we don't need user by user authentication, thanks Boyd)

const requestSetting = { 
	method: 'POST',
	url: 'https://api.twitter.com/oauth2/token', 
	headers: {
		'Authorization': config.authToken, 
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	body: 'grant_type=client_credentials' 
} 


request(reqOptions, (error, response, body) => {
	if (error) console.log(error); 
	console.log(body); 
	config.bearerToken = JSON.parse(body)["access_token"];
});


