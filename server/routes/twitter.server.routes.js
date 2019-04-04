var twitterSearch = require('../controllers/search.server.controller.js'),
	twitterTrends = require('../controllers/trends.server.controller.js')
	express = require('express'),
	router = express.Router();

//this is for the getAll method of the listingFactory in /client
//no parameters
router.route('/')
	.get(twitter.test); //the .get 

//this is for the areaTopic method of the listingFactory in /client
//place, topic, isHash are all parameters to the $http.get('/api/twitter/topicByArea/' + '/' + place + '/' + ...) query
router.route('/topicByArea/:place/:topic/:isHash')
	.get(twitter.areaTopicTweets);

//this is for the trendTopic method of the listingFactory in /client
//topic, isHash are parameters of the query
router.route('/trend/:topic/:isHash')
	.get(twitter.topicTweets);

//this is for the getTrends method of the listingFactory in /client
//userPlace is a parameter of the query
router.route('/:userPlace')
	.get(twitter.dynamicTrends);

module.exports = router;