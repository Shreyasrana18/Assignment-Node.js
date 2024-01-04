const express = require('express');
const validateToken = require('../Middlewares/validateToken');
const { signup, login,me } = require('../Controllers/userAuthController');
const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/me').get(validateToken,me);

module.exports = router;