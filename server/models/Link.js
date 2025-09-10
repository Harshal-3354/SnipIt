const mongoose = require("mongoose");
const Visit = require("./Visit");

const linkSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
    },
    expirationDate: {
      type: Date,
    },
    password: {
      type: String,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    clicks: [
      {
        ip: String,
        userAgent: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

linkSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Visit.deleteMany({ link: this._id });
      next();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = mongoose.model("Link", linkSchema);
