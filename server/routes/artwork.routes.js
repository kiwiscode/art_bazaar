const router = require("express").Router();
const Artwork = require("../models/Artwork.model");

router.get("/:artworkName", async (req, res) => {
  try {
    let { artworkName } = req.params;

    console.log("artworkname:", artworkName);

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
