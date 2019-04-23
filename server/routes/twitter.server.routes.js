var twitter = require('../controllers/twitter.server.controller.js'),
    express = require('express'),
    router = express.Router();

router.route('/')
    .get(twitter.test);

router.route('/topicByArea/:spotData/:topic/:hashCheck')
	.get(twitter.geoTopics);

router.route('/trend/:topic/:hashCheck')
	.get(twitter.tweetTopics);

router.route('/:userPlace')
	.get(twitter.liveTrends);



module.exports = router;
