const { Schema, model } = require("mongoose");
//
// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    works: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    verified: { type: Boolean, default: false },
    carts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    active: {
      type: Boolean,
      default: false,
    },

    order: [
      {
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        // You can add other relevant fields as needed for the order
      },
    ],
    isArtist: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: [
        {
          platform: String,
          link: String,
        },
      ],
    },
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
