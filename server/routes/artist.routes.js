const router = require("express").Router();
const Artwork = require("../models/Artwork.model");
const Artist = require("../models/Artist.model");
const Collector = require("../models/Collector.model");
const authenticateToken = require("../middleware/jwtMiddleware");

// get all artists
router.get("/all-artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:artistName", async (req, res) => {
  try {
    let { artistName } = req.params;
    artistName = artistName.toLowerCase();
    artistName = artistName.replace(/-/g, " ");

    const artist = await Artist.findOne({
      name: { $regex: new RegExp("^" + artistName + "$", "i") },
    });
    console.log("artist id:", artist._id);
    const artworks = await Artwork.find({
      creator: artist.name,
    });

    console.log("artwork:", artworks);

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    res.status(200).json({ artist, artworks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// follow artist
router.post(
  "/collectors/:collectorId/follow/:artistId",
  authenticateToken,
  async (req, res) => {
    try {
      const { collectorId, artistId } = req.params;

      console.log("collector id:", collectorId, "artist id:", artistId);

      const collector = await Collector.findById(collectorId);
      const artist = await Artist.findById(artistId);

      if (!collector || !artist) {
        return res.status(404).json({ error: "Collector or artist not found" });
      }

      const isAlreadyFollowing = collector.followedArtists.some(
        (followedArtistId) => followedArtistId.toString() === artistId
      );

      if (isAlreadyFollowing) {
        return res
          .status(400)
          .json({ message: "Collector already follows this artist" });
      }

      collector.followedArtists.unshift(artistId);
      await collector.save();

      return res.status(200).json({ message: "Artist followed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// undo follow artist
router.post(
  "/collectors/:collectorId/unfollow/:artistId",
  authenticateToken,
  async (req, res) => {
    try {
      const { collectorId, artistId } = req.params;

      console.log("collector id:", collectorId, "artist id:", artistId);

      const collector = await Collector.findById(collectorId);
      const artist = await Artist.findById(artistId);

      if (!collector || !artist) {
        return res.status(404).json({ error: "Collector or artist not found" });
      }

      const artistIndex = collector.followedArtists.findIndex(
        (followedArtistId) => followedArtistId.toString() === artistId
      );

      if (artistIndex === -1) {
        return res
          .status(400)
          .json({ message: "Collector does not follow this artist" });
      }

      collector.followedArtists.splice(artistIndex, 1);
      await collector.save();

      return res
        .status(200)
        .json({ message: "Artist unfollowed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// search artist with query
router.get("/", async (req, res) => {
  let searchQuery = req.query.q;
  searchQuery = searchQuery.replace(/\s+/g, "").toLowerCase();
  const regex = new RegExp(searchQuery, "i");
  console.log("search query:", searchQuery);
  try {
    const artists = await Artist.find({});
    const filteredArtists = artists.filter((artist) => {
      const formattedName = artist.name.replace(/\s+/g, "").toLowerCase();
      return regex.test(formattedName);
    });
    res.json(filteredArtists);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
