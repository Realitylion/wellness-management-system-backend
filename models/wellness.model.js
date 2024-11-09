const mongoose = require('mongoose');

const wellnessSessionSchema = new mongoose.Schema({
    sessionType: {
        type: String,
        enum: ['Yoga', 'Meditation', 'Self-Acceptance', 'Jog', 'Cardio Dance', 'Therapy Music'], // Specific session types
        required: true,
        trim: true
    },
    duration: {
        type: Number, // Duration in number of minutes
        required: true,
        min: 1
    },
    sessionDate: {
        type: Date,
        required: true
    },
    email: {
        type: String, // User email for identification
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    }
});

const WellnessSession = mongoose.model('WellnessSession', wellnessSessionSchema);
module.exports = WellnessSession;