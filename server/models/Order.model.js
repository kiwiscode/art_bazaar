const { Schema, model } = require("mongoose");

const shippingAddressSchema = new Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state_provinence_or_region: { type: String, required: true },
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  settedAsDefault: { type: Boolean, default: false },
});

const orderSchema = new Schema(
  {
    collectorId: {
      type: Schema.Types.ObjectId,
      ref: "Collector",
      required: true,
    },
    artworkToPurchase: {
      type: Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
    allDeliveryData: {
      shippingAddress: shippingAddressSchema,
      paymentInfo: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "RETURNED", "CANCELED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
