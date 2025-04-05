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
      type: {
        type: String,
        enum: ["unlimited", "days", "monthly", "annual"],
        required: true,
      },
      value: {
        type: Number,
        default: null,
        required: function() {
          return this.duration.type !== "unlimited";
        }
      }
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
    rules: {
      sessions: {
        type: Number,
        default: 0, // -1 significa illimitato
      },
      spins: {
        type: Number,
        default: 0, // -1 significa illimitato
      },
      prediction: {
        type: String,
        enum: ["none", "base", "full"],
        default: "none"
      }
    },
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
