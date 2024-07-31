const { Schema, model } = require("mongoose");

const artworkSchema = new Schema({
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
});

const Artwork = model("Artwork", artworkSchema);

module.exports = Artwork;
