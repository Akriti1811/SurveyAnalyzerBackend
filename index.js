const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const passport = require('passport');
const session = require('express-session');
require('./middleware/passport');
// const { generateData } = require('./functions/DataGenerator');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URL);

// Define routes here
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
// generateData();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
