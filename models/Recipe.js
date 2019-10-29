const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecipeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    // recipePic: {
    //     type: String,
    //     required: true
    // },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        measurement: {
            type: String,
            required: true
        },
        // type: {
        //     type: String,
        //     required: true
        // },
    }],
    instructions: [{
        steps: {
            type: String,
            required: true
        }
    }],
    // score: {
    //     type: Number,
    //     required: false
    // },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('recipes', RecipeSchema);