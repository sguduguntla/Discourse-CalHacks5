const mongoose = require('mongoose')
const User = require('./models/user');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/CalHacks5')
mongoose.connection.once('open', () => console.log('Good to go')).on('error', (error) => {
    console.warn('Warning', error)
});

// const priyans = new User({title: "Priyans Desai", email: 'priyansdesai@gmail.com'})

// priyans.save().then(() => {
//     User.find({ name: 'Priyans Desai' }).then((users) => {
//         console.log(users)
//     });
// })
