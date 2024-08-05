const { Schema, model } = require("mongoose");

const artworkSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    creator: { type: String, required: true },
    artworkName: { type: String, required: true },
    header: { type: String },
    aboutTheWork: {
      materials: { type: String },
      size: { type: String },
      rarity: { type: String },
      medium: { type: String },
      condition: { type: String },
      signature: { type: String },
      certificateOfAuthenticity: { type: String },
      frame: { type: String },
      series: { type: String },
      publisher: { type: String },
      currentLocation: { type: String },
      currentCountry: { type: String },
    },
    category: {
      type: String,
      default: "",
      enum: [
        "Contemporary Art",
        "Painting",
        "Street Art",
        "Photography",
        "Emerging Art",
        "20th-Century Art",
      ],
    },
    is_sold: {
      type: Boolean,
      default: false,
    },
    an_offer_can_be_made: {
      type: Boolean,
      default: false,
    },
    unsellable_artwork: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = model("Artwork", artworkSchema);

module.exports = Artwork;
