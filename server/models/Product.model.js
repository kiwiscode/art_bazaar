const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    rating: {
      type: Number,
    },
    image: {
      type: String,
      default: "default@productImg",
    },
    quantity: {
      type: Number,
      min: 0,
      default: 1,
    },
    artist: {
      type: String,
      required: true,
    },
    period: {
      type: String,
    },
    signature: {
      type: String,
      required: true,
    },
    technique: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
