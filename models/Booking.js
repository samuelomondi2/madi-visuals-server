const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  booking_date:    { type: String,  required: true },
  start_time:      { type: String,  required: true },
  client_name:     { type: String,  required: true, trim: true },
  client_email:    { type: String,  required: true, trim: true, lowercase: true },
  client_phone:    { type: String,  required: true, trim: true },
  location:        { type: String, trim: true },
  notes:           { type: String,  trim: true },
  total_amount:    { type: Number,  required: true, min: 0 },
  payment_status:  { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending'
  },
  booking_status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  agreed_to_terms: { type: Boolean, required: true, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);


