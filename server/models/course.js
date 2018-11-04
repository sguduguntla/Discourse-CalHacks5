const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: String,
    description: String,
    class_key: {
        type: String,
        default: () => {
            const text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

CourseSchema.pre('remove', (next) => {
    const User = mongoose.model('user');

    User.find({
        courses: this._id
    }).then((users) => {
        users.forEach(user => user.courses.splice(user.courses.indexOf(this._id), 1))
    });
});

const Course = mongoose.model('course', CourseSchema);

module.exports = Course;