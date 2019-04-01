//const btoa = require ('btoa');
const twit = require('twit')
// Needed for the 

const consumer_key = '0Ce89vEhtDVJRrznQRs13kVnQ';
const consumer_secret = 'RceoBEhRvmGWioysz5PrDDGgv1OhKlITmbKkjEIpJZTxc6BZZM';
const access_token = '1070800768230400001-S7sB9x9emGcGJeNPQHOp6xaCUxLqMl';
const access_token_secret = 'V7djS4GQmrl3d2soJEm0T30KSev6bpP15i7fJ4dFemNuF';
module.exports = { 
	db: { 
		uri: '',  
	}, 

	port: process.env.PORT || 8080, 
	// This is needed or heroku breaks
};


