const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadSchema = new Schema(
  {
    url: { type: String, required: true },
    filePath: { type: String, default: null },
    fileName: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Download = mongoose.model("Download", downloadSchema);
module.exports = Download;
