const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    topics: [String],
    content: String,
    approved: Boolean,
    gsi_votes: 0,
    student_votes: 0,
    likes: 0,
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    type: {
        type: String,
        default: 'post'
    }, //'post' or 'comment'
    createdAt: {
        type: Date,
        default: Date.now
    },
    likedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    },
    _author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'post' //To reference that the id will be of a comment
    }]
});

PostSchema.pre('update', (next) => {
    this.approved = gsi_votes > 0 || student_votes >= 5
    next();
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
