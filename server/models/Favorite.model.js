const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    favoritedArtwork: {
      type: Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
    collector: {
      type: Schema.Types.ObjectId,
      ref: "Collector",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
