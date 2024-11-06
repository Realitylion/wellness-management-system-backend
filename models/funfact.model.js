const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
  fact: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('FunFact', funFactSchema);
