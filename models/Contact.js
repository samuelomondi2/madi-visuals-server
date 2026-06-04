const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, trim: true },
  phone:       { type: String, required: true },
  message:     { type: String, required: true },
  status:      { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
  is_deleted:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
