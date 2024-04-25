const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../middleware/pagination');

mongoose.set('debug', true);

const userDataSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			ref: 'User'
		},
        data: [
            {
                fileName: {type : String, required: true},
                fileContent: {type : String, required: true}
            }
        ]
	},
	{ timestamps: true }
);

userDataSchema.plugin(paginate);

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
