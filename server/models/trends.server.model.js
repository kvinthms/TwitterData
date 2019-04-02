var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;


var trendSchema = new Schema({
	name: {
		type: String, 
		required: true, 
		unique: true
	},
	url: {
		type: String, 
		required: true, 
		unique: true, 
	},
	query: String, 
