const { Schema, model } = require("mongoose");

const artworkSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
    verified: { type: Boolean, default: false },
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
      },
    ],
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
    isWelcomeModalShowed: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
    },
    favoriteArtworks: [artworkSchema],
  },

  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
