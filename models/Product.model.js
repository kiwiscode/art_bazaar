const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    // productId: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   unique: true,
    // },
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
      default: "../public/images/no-product.png",
    },
    quantity: {
      type: Number,
      min: 0,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// module.exports = model("Product", productSchema);
const Product = model("Product", productSchema);

module.exports = Product;
