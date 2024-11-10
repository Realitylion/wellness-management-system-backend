const mongoose = require('mongoose');

const funFactSchema = new mongoose.Schema({
  fact: {
    type: String,
    required: true
  }
});

const FunFact = mongoose.model('FunFact', funFactSchema);
module.exports = FunFact;