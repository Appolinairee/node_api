require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger }= require('./middlewares/logEvents');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnect')
const verifyJWT = require('./middlewares/verifyJWT');

const PORT = process.env.PORT || 3500;
// connectDB();je suis
app.use(logger)

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.use('/', require('./routes/rout'))
app.use('/api', require('./routes/api/employees'));
app.use('/register', require('./routes/register'));
app.use(verifyJWT);
app.use('/auth', require('./routes/auth'));

app.get('/*', (req, res) => {
    res.status(404).send('404 Error');
})

app.listen(PORT ,()=> console.log(`Server running on port ${PORT}`));

// mongoose.connection.once('open', () => {
//     console.log('Connected to mongoDB');
// });
