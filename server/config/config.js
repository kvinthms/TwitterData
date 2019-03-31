const btoa = require ('btoa'); 
// Needed for the 


const apiKey = 'insert API we are using here' 
const secret = " insert whatever secret assigned for said API key here" 
const b64Encoded = 'Basic ' + btoa('${apiKey}:${secret}');

module.exports = { 
	db: { 
		uri: 'Not even sure if we are still using a DB with Alyssas solution but will leave this here for now' 
	}, 

	port: process.env.PORT || 8080, 
	// This is needed or heroku breaks
	authToken: b64Encoded,
	bearerToken: 'Fill this in' 
};


