import mongoose from "mongoose";

const schema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
  },
  regNo: {
    type: String,
  },
  email: {
    type: String,
  },
  purpose: {
    type: String,
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },
});

export const Booking = mongoose.model("Booking", schema);
