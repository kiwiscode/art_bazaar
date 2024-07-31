const { Schema, model } = require("mongoose");

const collectorSchema = new Schema(
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
    profileImage: { type: String, default: "@imageUrl" },
    verified: { type: Boolean, default: false },
    active: {
      type: Boolean,
      default: false,
    },
    isSeller: { type: Boolean, default: false },
    isArtist: { type: Boolean, default: false },
    artistProfile: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    followedArtists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    collection: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    artWorks: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
    favoriteArtworks: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
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
  },
  {
    timestamps: true,
  }
);

const Collector = model("Collector", collectorSchema);

module.exports = Collector;
