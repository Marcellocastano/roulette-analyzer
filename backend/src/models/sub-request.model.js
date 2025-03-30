const mongoose = require("mongoose");
const subscriptionRequestSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["new", "renewal", "upgrade"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    processedDate: {
      type: Date,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin che ha processato la richiesta
      default: null,
    },
    paymentDetails: {
      transactionId: String,
      amount: Number,
      paymentLink: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      paymentDate: Date,
    },
    notes: {
      type: String,
      default: null,
    },
    // Se approvata, riferimento all'abbonamento creato
    resultingSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubscriptionRequest", subscriptionRequestSchema);
