const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const authRoutes = require('./routes/authRoutes');
// const { generateData } = require('./functions/DataGenerator');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL);

// Define routes here
app.use('/auth', authRoutes);
// generateData();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
