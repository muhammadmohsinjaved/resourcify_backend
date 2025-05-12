import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  coverImage: {
    url: {
      type: String,
      required: true,
      default: "temp_url",
    },
    public_id: {
      type: String,
      required: true,
      default: "temp_id",
    },
  },
  status: {
    type: String,
    enum: ["available", "reserved"],
    default: "available",
  },
  availabilityHours: {
    start: { type: String, required: true }, // e.g., "08:30"
    end: { type: String, required: true }, // e.g., "16:30"
  },
});

export const Room = mongoose.model("Room", schema);
