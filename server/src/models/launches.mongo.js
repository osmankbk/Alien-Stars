const mongoose = require('mongoose');
const launchesScheme = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDaate: {
    type: Date,
    required: true,
  },
  mission:{
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  customer: [ String ],
  upcoming: {
    type: Boolean,
    required: true,
  }, 
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});