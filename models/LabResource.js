import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  version: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },

  instructions: [
    {
      type: String,
      required: true,
    },
  ],

  os: {
    type: String,
    required: true,
  },

  publisher: {
    type: String,
    required: true,
  },

  size: {
    type: String,
    required: true,
  },

  image: {
    public_id: {
      type: String,
      default: "temp_id",
    },
    url: {
      type: String,
      default: "temp_string",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

export const LabResource = mongoose.model("LabResource", schema);
