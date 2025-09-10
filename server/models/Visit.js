const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  ip: String,
  deviceType: String, // desktop / mobile / tablet
  browser: String,
  browserVersion: String,
  os: String,
  referrer: String, // google.com, facebook.com etc
  location: {
    country: String,
    region: String,
    city: String,
    isp: String,
    lat: Number,
    lon: Number,
  },
  isUnique: { type: Boolean, default: false }, // unique visitor flag
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Visit", visitSchema);
