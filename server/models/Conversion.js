// server/models/Conversion.js
const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  originalFilename: {
    type: String,
    required: true,
  },
  convertedFilename: {
    type: String,
    required: true,
  },
  uploadTimestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversion', conversionSchema);