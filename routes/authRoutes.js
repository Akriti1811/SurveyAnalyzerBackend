const express = require('express');

const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const inputValidation = require('../validator/validateRequest');
// const rateLimiter = require('../middleware/rateLimiter');
// const { logMiddleware } = require('../middleware/logger');/
const uservalidator = require('../validator/user');
require('../middleware/passport');
const { signToken } = require('../middleware/jwt');

router.post(
	'/register',
	uservalidator.validate('registerUser'), // validation middleware
	inputValidation, // custom validation middleware
	rateLimiter,
	// cache,
	logMiddleware,
	AuthController.register // controller
);

router.post(
	'/registerDetails',
	rateLimiter,
	logMiddleware,
	AuthController.registerDetails
);

router.post(
	'/forgotPassword/check',
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordEmailCheck
);

router.post(
	'/forgotPassword/verify',
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordEmailVerify
);

router.post(
	'/forgotPassword/reset',
	uservalidator.validate('forgotPassword'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordReset
);

// Log in a user
router.post(
	'/login',
	uservalidator.validate('login'), // validation middleware
	inputValidation, // custom validation middleware
	rateLimiter,
	logMiddleware,
	AuthController.login
);

module.exports = router;
