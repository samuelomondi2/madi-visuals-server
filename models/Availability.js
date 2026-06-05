const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day_of_week: {
    type:     Number,
    required: true,
    unique:   true,
    min:      0,  // 0 = Sunday
    max:      6,  // 6 = Saturday
  },
  start_time:  { type: String, required: true }, // "09:00"
  end_time:    { type: String, required: true }, // "17:00"
  is_available:{ type: Boolean, default: true }, // toggle day off without deleting
  slot_duration_mins: { type: Number, default: 60 }, // how long each booking slot is
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);