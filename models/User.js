const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: {
        type: Array,
        required: false,
        ref: "favorites"
    },
    score: {
        type: Number,
        required: false
    },
    friends: [{
        users: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    followers: {
        type: Array,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);