import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subtitle: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["book", "journal", "fyp"],
  },

  author: {
    type: String,
    required: true,
  },

  edition: {
    type: String,
  },

  location: {
    type: String,
  },
  isbn: {
    type: String,
  },
  publisherCode: {
    type: String,
  },
  copyright: {
    type: String,
  },

  status: {
    type: String,
    required: true,
    enum: ["available", "borrowed"],
    default: "available",
  },

  file: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
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

export const LibraryItem = mongoose.model("LibraryItem", schema);
