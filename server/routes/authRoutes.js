const mongoose = require('mongoose');
const passport = require('passport');
const Course = mongoose.model('course');
const User = mongoose.model('user');

module.exports = (app) => {
    app.get("/auth/google", passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    
    app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/api/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });

    app.post('/api/new', (req, res) => {
        User.findById(req.body.user._id).then(user => {
            Course.find({class_key: req.body.classKey}).then(courses => {
                if (courses) {
                    user.courses.push(courses[0]._id);
                    user.save(() => {
                        res.send({message: "You have been enrolled in " + courses[0].name + "!"});
                    });
                } else {
                    //Error
                    res.send({error: "Could not find course with class key: " + req.body.classKey});
                }
            });
        });

    });
};
