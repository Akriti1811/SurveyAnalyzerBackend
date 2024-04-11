const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../middleware/pagination');

mongoose.set('debug', true);

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
