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
        required: false
    },
    score: {
        type: Number,
        required: false
    },
    following: {
        type: Array,
        required: false
    },
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