var twitter = require('../controllers/twitter.server.controller.js'),
    express = require('express'),
    router = express.Router();

router.route('/')
    .get(twitter.test);

router.route('/topicByArea/:place/:topic/:isHash')
	.get(twitter.areaTopicTweets);

router.route('/trend/:topic/:isHash')
	.get(twitter.topicTweets);

router.route('/:userPlace')
	.get(twitter.dynamicTrends);



module.exports = router;
