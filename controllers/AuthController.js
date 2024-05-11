const User = require('../models/User');
const { encrypt, compare } = require('../middleware/bcrypt');
const { signToken } = require('../middleware/jwt');

exports.register = async (req, res) => {
	try {
		const isEmailExisting = await User.findOne({ email: req.body.email });
		if (isEmailExisting) {
			return res
				.status(401)
				.json({ message: 'Email Already exists' });
		}

		const hashedPassword = await encrypt(req.body.password);
		if (!hashedPassword) {
			return res.status(500).json({ message: 'Error hashing password' });
		}

		const newUser = await User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: hashedPassword,
		});

		if (!newUser) {
			return res.status(401).json({ message: 'Unable to sign you up' });
		}
		const token = signToken(req.body.email);
        return res.status(200).json({
            message: 'Succesfully Registered',
            email: newUser.email,
			token,
        });
	} catch (error) {
		return res.status(401).json({
			message: 'Unable to sign up, Please try again later',
			error,
		});
	}
};

exports.login = async (req, res) => {
	try {
		// Check if user exists
		let auth = await User.findOne({ email: req.body.email });
		if (!auth) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Verify password
		await compare(
			req.body.password,
			auth.password,
			(bcryptError, bcryptResult) => {
				if (bcryptResult) {
					const token = signToken(auth.email);
					return res
						.status(200)
						.json({ token, email: auth.email });
				}
				return res.status(400).json({
					message:
						'Authentication failed. Invalid email or password.',
				});
			}
		);
	} catch (error) {
		logger.error(error.message);
		return res.status(400).json({ message: 'Login failed!' });
	}
};