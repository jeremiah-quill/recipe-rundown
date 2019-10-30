const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecipeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    username: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    // recipePic: {
    //     type: String,
    //     required: true
    // },
    ingredients: {
        name: {
            type: Array,
            required: true
        },
        quantity: {
            type: Array,
            required: true
        },
        measurement: {
            type: Array,
            required: true
        },
        // type: {
        //     type: String,
        //     required: true
        // },
    },
    instructions: {
            type: Array,
            required: true
    },
    // score: {
    //     type: Number,
    //     required: false
    // },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('recipes', RecipeSchema, 'recipes');