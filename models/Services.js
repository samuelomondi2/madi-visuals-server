const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  duration:    { type: Number, min: 0 },
  base_price:  { type: Number, required: true, min: 0 },
  delivery:    { type: String, trim: true},
  category:    { type: String, trim: true },
  is_active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

