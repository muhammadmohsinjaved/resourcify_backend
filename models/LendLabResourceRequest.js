import mongoose from "mongoose";

const schema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabResource",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  purpose: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const LendLabResource = mongoose.model("LendLabResource", schema);
