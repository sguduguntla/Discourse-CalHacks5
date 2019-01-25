const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
    name: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }, 
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }, 
    status: {
        type: Boolean,
        required: true,
        default: false
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

const FriendRequest = mongoose.model('friendRequest', FriendRequestSchema);

module.exports = FriendRequest;