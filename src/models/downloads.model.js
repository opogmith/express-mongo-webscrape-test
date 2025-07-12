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
    failureReason: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Download", downloadSchema);
