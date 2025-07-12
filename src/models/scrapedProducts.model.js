const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScrapedProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    imageURL: { type: String, required: true },
    availability: {
      type: String,
      required: true,
      enum: ["In stock", "Out of stock"],
      default: "In stock",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScrapedProduct", ScrapedProductSchema);
