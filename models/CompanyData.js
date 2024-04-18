const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../middleware/pagination');

mongoose.set('debug', true);

const companyDataSchema = new Schema(
	{
		companyName: {
			type: String,
			required: true,
			trim: true,
		},
        averageOverallSatisfaction: {
            type: Number,
            required: true,
        },
        averageJobSatisfaction: {
            type: Number,
            required: true,
        },
        averageOrganizationalCulture: {
            type: Number,
            required: true,
        },
        averageWorkLifeBalance: {
            type: Number,
            required: true,
        },
		data: [
            {
                name: { type: String, required: true },
                email: { type: String, required: true },
                region: { type: String, required: true },
                role: { type: String, required: true },
                department: { type: String, required: true },
                gender: { type: String, required: true, enum: ['male', 'female'],},
                tenure: { type: Number, required: true },
                overallSatisfaction: { type: Number, required: true },
                jobSatisfaction: { type: Number, required: true },
                organizationalCulture: { type: Number, required: true },
                workLifeBalance: { type: Number, required: true }
            }
        ]
	},
	{ timestamps: true }
);

companyDataSchema.plugin(paginate);

const CompanyData = mongoose.model('CompanyData', companyDataSchema);

module.exports = CompanyData;
