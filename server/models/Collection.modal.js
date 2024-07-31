const { Schema, model } = require("mongoose");

const artworksUploaded = new Schema({
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
  artistName: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  materials: {
    type: String,
  },
  rarity: {
    type: String,
  },
  dimensions: {
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    depth: {
      type: Number,
    },
    in: {
      type: String,
    },
    cm: {
      type: String,
    },
  },
  pricePaid: {
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
    },
  },
  provenance: {
    type: String,
  },
  city: {
    type: String,
  },
  notes: {
    type: String,
  },
  shareWithGalleries: {
    type: Boolean,
    default: false,
  },
  uploadedPhotos: [
    {
      type: String, // photos are as URLs
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const collectionSchema = new Schema({
  shareWithGalleries: {
    type: Boolean,
    default: false,
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: "Artist",
  },
  artistDeletedFromCollection: {
    type: Boolean,
    default: false,
  },
  collector: {
    type: Schema.Types.ObjectId,
    ref: "Collector",
  },
  artworksUploaded: [artworksUploaded],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = model("Collection", collectionSchema);

module.exports = Collection;
