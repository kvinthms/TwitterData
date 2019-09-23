var twitter = require('../controllers/twitter.server.controller.js'),
    express = require('express'),
    router = express.Router();

router.route('https://vast-scrubland-38554.herokuapp.com/')
    .get(twitter.test);

router.route('https://vast-scrubland-38554.herokuapp.com/topicByArea/:place/:topic/:isHash')
	.get(twitter.areaTopicTweets);

router.route('https://vast-scrubland-38554.herokuapp.com/trend/:topic/:isHash')
	.get(twitter.topicTweets);

router.route('https://vast-scrubland-38554.herokuapp.com/:userPlace')
	.get(twitter.dynamicTrends);



module.exports = router;
