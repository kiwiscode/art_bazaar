const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Artwork = require("../models/Artwork.model");
const Artist = require("../models/Artist.model");

const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(async (x) => {
    const databaseName = x.connections[0].name;
    console.log("connected to the database:", databaseName);

    // const artworkData = JSON.parse(
    //   fs.readFileSync(
    //     path.join(__dirname, "../../client/src/data/dataArtwork.json"),
    //     "utf8"
    //   )
    // );

    // console.log("artwork data:", artworkData);

    // for (const artwork of artworkData) {
    //   try {
    //     const artist = await Artist.findOne({ name: artwork.creator });

    //     if (!artist) {
    //       console.log(`Artist with name "${artwork.creator}" not found.`);
    //       continue;
    //     }

    //     artwork.artist = artist._id;

    //     const newArtwork = new Artwork(artwork);
    //     await newArtwork.save();
    //     console.log(
    //       `Artwork "${artwork.title}" by artist "${artist.name}" successfully added to the database.`
    //     );
    //   } catch (err) {
    //     console.error(`Error processing artwork "${artwork.title}": `, err);
    //   }
    // }
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
