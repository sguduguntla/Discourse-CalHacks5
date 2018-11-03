const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const validator = require('validator');

const UserSchema = new Schema({
    name: String,
    googleId: String,
    email: {
        type: String,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    reputation: 0,
    bio: String,
    role: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('remove', (next) => {
    const Post = mongoose.model('post');

    Post.remove({
        _author: this._id
    }).then(() => next())
});

const User = mongoose.model('user', UserSchema);

module.exports = User;