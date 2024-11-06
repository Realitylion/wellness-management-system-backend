// models/wellnessEntry.model.js
const mongoose = require('mongoose');

const WellnessEntrySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    date: { type: Date, default: Date.now } // Date field to track the creation date
});

module.exports = mongoose.model('WellnessEntry', WellnessEntrySchema);
