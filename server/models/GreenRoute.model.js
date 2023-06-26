const mongoose = require('mongoose');

const GreenRouteSchema = new mongoose.Schema({
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  distance: { type: Number, required: true },
  carbonFootprint: { type: Number, required: true },
  mode: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('GreenRoute', GreenRouteSchema);
