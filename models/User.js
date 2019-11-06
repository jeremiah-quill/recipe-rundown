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
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'recipes'
    }],
    favorites: [{
        static: {
            type: Object
        },
        live: {
            type: Schema.Types.ObjectId,
            ref: 'recipes'
        }
    }],
    score: {
        type: Number,
        required: false
    },
    following: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('users', UserSchema);