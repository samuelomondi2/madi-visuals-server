const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title:     { type: String },
  name:    { type: String },
  description:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
