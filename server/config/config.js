//const btoa = require ('btoa');
const twit = require('twit')

module.exports = { 
	db: { 
		uri: '', //mongodb URI goes here...  
	}, 

	port: (process.env.PORT || 8080) 
	// This is needed or heroku breaks
};


