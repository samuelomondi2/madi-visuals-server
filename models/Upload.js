const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  media_url:     { type: String },
  media_type:    { type: String },
  public_id:     { type: String },
  size:          { type: Number },
  is_hero:       { type: Boolean },
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);

