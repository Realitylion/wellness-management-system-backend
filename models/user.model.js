const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    height: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 1,
        max: 1000
    },
    weight: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 1,
        max: 1000
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 150
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    mealLogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MealLog'
        }
    ]
});

const User = mongoose.model('User', userSchema);
module.exports = User;