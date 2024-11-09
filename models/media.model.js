const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Video', 'Audio'],
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    sessionType: {
        type: String,
        required: true,
        trim: true,
        enum: ['Yoga', 'Meditation', 'Self-Acceptance', 'Jog', 'Cardio Dance', 'Therapy Music']
    }
});

const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;