const mongoose = require('mongoose');

const wellnessSessionSchema = new mongoose.Schema({
    sessionType: {
        type: String,
        enum: ['Yoga', 'Meditation', 'Self-Acceptance', 'Jog', 'Cardio Dance', 'Therapy Music'], // Specific session types
        required: true,
        trim: true
    },
    meditationVideo: {
        type: String, // Path or URL to the meditation video file
        trim: true,
        required: function() { return this.sessionType === 'Meditation'; } // Required if session type is Meditation
    },
    audioFile: {
        type: String, // Path or URL to the audio file
        trim: true,
        required: function() { return this.sessionType !== 'Meditation'; } // Required if session type is not Meditation
    },
    duration: {
        type: Number, // Duration in minutes or seconds
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