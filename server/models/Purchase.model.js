const { Schema, model } = require("mongoose");

const purchaseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      // required: true,
    },
    quantity: {
      type: Number,
      // required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      // required: true,
    },
    paymentMethod: {
      type: String,
      // required: true,
    },
    address: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Purchase = model("Purchase", purchaseSchema);

module.exports = Purchase;
