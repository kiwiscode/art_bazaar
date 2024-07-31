const { Schema, model } = require("mongoose");

const artistSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true,
  },
  born: {
    type: String,
    trim: true,
  },
  died: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  highAuctionRecord: {
    title: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    auctionHouse: {
      type: String,
      trim: true,
    },
    salePrice: {
      type: String,
      trim: true,
    },
  },
  criticallyAcclaimed: {
    type: String,
    trim: true,
  },
  recentSoloShows: [
    {
      title: {
        type: String,
        trim: true,
      },
      institution: {
        type: String,
        trim: true,
      },
      year: {
        type: String,
        trim: true,
      },
    },
  ],
  profilePic: {
    type: String,
    trim: true,
    default: "@imageUrl",
  },
  artWorks: [{ type: Schema.Types.ObjectId, ref: "Artwork" }],
  isAlsoCollector: { type: Boolean, default: false },
  collectorProfile: [{ type: Schema.Types.ObjectId, ref: "Collector" }],
  followedArtists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "Collector" }],
  contact: {
    type: [
      {
        platform: String,
        link: String,
      },
    ],
  },
});

const Artist = model("Artist", artistSchema);

module.exports = Artist;
