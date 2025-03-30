const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    sessions: {
      count: {
        type: Number,
        default: 0
      },
      lastReset: {
        type: Date,
        default: Date.now
      }
    },
    paymentDetails: {
      transactionId: String,
      amount: Number,
      currency: {
        type: String,
        default: "EUR",
      },
      provider: {
        type: String,
        default: "SumUp",
      },
      paymentLink: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      paymentDate: Date,
    },
    activatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin che ha attivato l'abbonamento
      default: null,
    },
    activationDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Metodo per verificare se l'abbonamento è attivo
subscriptionSchema.methods.isActive = function () {
  const now = new Date();
  return (
    this.status === "active" &&
    this.startDate <= now &&
    (this.endDate === null || this.endDate >= now)
  );
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
