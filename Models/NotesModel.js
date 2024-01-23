const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "General",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Notes = mongoose.model("note", notesSchema);

module.exports = Notes;