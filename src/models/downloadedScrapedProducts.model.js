const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const downloadScrapedProductsSchema = new Schema(
  {
    imageURL: { type: String, required: true },
    localPath: { type: String, default: null },
    title: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DownloadedScrapedProduct",
  downloadScrapedProductsSchema
);
