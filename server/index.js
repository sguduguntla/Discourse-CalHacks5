const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport'); //not returning anything

mongoose.Promise = global.Promise;

mongoose.connect(keys.mongoURI)
mongoose.connection.once('open', () => console.log('Good to go')).on('error', (error) => {
    console.warn('Warning', error)
});

const app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, //millis
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session())

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT)