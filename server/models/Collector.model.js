const { Schema, model } = require("mongoose");

const deliveryAddressSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state_provinence_or_region: {
    type: String,
  },
  postalCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  settedAsDefault: {
    type: Boolean,
    default: false,
  },
});

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
    location: {
      type: String,
      default: "Germany",
    },
    profession: {
      type: String,
      default: "",
    },
    otherRelevantPosition: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    priceRange: {
      type: String,
      default: "",
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
    deliveryAddresses: [deliveryAddressSchema],
  },
  {
    timestamps: true,
  }
);

const Collector = model("Collector", collectorSchema);

module.exports = Collector;
