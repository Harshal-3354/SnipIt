const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  ip: String,
  device: String,
  browser: String,
  location: {
    country: String,
    region: String,
    city: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visit", visitSchema);
