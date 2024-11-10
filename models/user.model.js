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
    phoneNumber: {
        type: String,
        required: false,
        trim: true,
        minlength: 10,
        maxlength: 15
    },
    profileCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    dob: {
        type: Date,
        required: false
    },
    bloodGroup: {
        type: String,
        required: false,
        trim: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    height: {
        type: mongoose.Types.Decimal128,
        required: false,
        min: 1,
        max: 1000
    },
    weight: {
        type: mongoose.Types.Decimal128,
        required: false,
        min: 1,
        max: 1000
    },
    healthIssuesOrAllergies: {
        type: String,
        required: false,
        trim: true,
        maxlength: 255
    },
    priorInjuries: {
        type: String,
        required: false,
        trim: true,
        maxlength: 255
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female', 'Other']
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
