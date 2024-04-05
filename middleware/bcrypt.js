const bcrypt = require('bcrypt');
const { logger } = require('./logger');

const saltRounds = 10;

exports.encrypt = async (data) => {
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(data, salt);
		return hash;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

exports.compare = async (data, hash, callback) => {
	try {
		return bcrypt.compare(data, hash, (bcryptError, bcryptResult) =>
			callback(bcryptError, bcryptResult)
		);
	} catch (error) {
		logger.error(error);
		return false;
	}
};
