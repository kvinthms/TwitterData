var loginController = require('../controllers/login.server.controller'),
    express = require('express'),
    router = express.Router();

router.route('/signup').post(loginController.register());

router.route('/login').post(loginController.validate());

module.exports = router;
