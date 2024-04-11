const express = require('express');

const router = express.Router();
// const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const inputValidation = require('../validator/validateRequest');
const uservalidator = require('../validator/user');
// require('../middleware/passport');

router.post(
	'/register',
	uservalidator.validate('registerUser'),
	inputValidation,
	AuthController.register
);

router.post(
	'/login',
	uservalidator.validate('login'),
	inputValidation,
	AuthController.login
);

module.exports = router;
