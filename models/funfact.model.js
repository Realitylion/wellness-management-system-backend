const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
    fact: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FunFact', funFactSchema);
