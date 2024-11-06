const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
    meal: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    calories: {
        type: Number,
        required: true,
        min: 1,
        max: 10000
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const MealLog = mongoose.model('MealLog', mealLogSchema);
module.exports = MealLog;