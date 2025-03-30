const mongoose = require("mongoose");
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["free", "trial", "premium"],
      required: true,
    },
    duration: {
      type: String,
      enum: ["unlimited", "days", "monthly", "annual"],
      required: true,
    },
    durationValue: {
      type: Number,
      default: null, // Per trial potrebbe essere 3 (giorni)
      required: function () {
        return this.duration !== "unlimited";
      },
    },
    price: {
      amount: {
        type: Number,
        required: function () {
          return this.type !== "free" && this.type !== "trial";
        },
        default: 0,
      },
      currency: {
        type: String,
        default: "EUR",
      },
    },
    sessions: {
      total: {
        type: Number,
        default: 0,
      },
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentLink: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Plan", planSchema);
