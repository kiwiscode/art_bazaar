const router = require("express").Router();
const Artwork = require("../models/Artwork.model");

router.get("/all-artworks", async (req, res) => {
  try {
    // const artworks = await Artwork.find({ is_sold: false });
    const artworks = await Artwork.find();

    if (!artworks) {
      return res.status(404).json({ message: "No artworks found" });
    }

    return res.status(200).json(artworks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/all-artworks/with_id/:artworkId", async (req, res) => {
  try {
    const { artworkId } = req.params;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(artwork);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:artworkName", async (req, res) => {
  try {
    let { artworkName } = req.params;

    const artwork = await Artwork.findOne({
      urlName: { $regex: new RegExp("^" + artworkName + "$", "i") },
    }).populate("artist");

    res.status(200).json({ artwork });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
