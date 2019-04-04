var twitter = require('../controllers/search.server.controller.js'),
	express = require('express'),
	router = express.Router();

router.route('/trend/:topic/:isHash')
	.get(twitter.tweetsByQ);

router.route('/:userPlace') //not sure about the argument userPlace, will have to keep an eye out for where else it appears in Holy Grail
	.get(twitter.trendsByLoc);

module.exports = router;