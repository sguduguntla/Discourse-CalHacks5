const mongoose = require('mongoose')
const User = require('./models/user');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/CalHacks5')
mongoose.connection.once('open', () => console.log('Good to go')).on('error', (error) => {
    console.warn('Warning', error)
});