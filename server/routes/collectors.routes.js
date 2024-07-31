const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const Collector = require("../models/Collector.model");
const Collection = require("../models/Collection.modal");
const Artist = require("../models/Artist.model");
const cloudinary = require("../utils/Cloudinary");

// welcome modal status
router.patch(
  "/:collectorId/welcome-modal-status",
  authenticateToken,
  async (req, res) => {
    try {
      const { collectorId } = req.params;
      const updatedCollector = await Collector.findByIdAndUpdate(
        collectorId,
        { isWelcomeModalShowed: true },
        { new: true }
      );
      res.status(200).json(updatedCollector);
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// get collector
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const collector = await Collector.findById(id)
      .populate("followedArtists")
      .populate("collection")
      .populate({
        path: "collection",
        populate: {
          path: "artist",
          model: "Artist",
        },
      })
      .populate({
        path: "collection",
        populate: {
          path: "collector",
          model: "Collector",
        },
      })
      .populate("favoriteArtworks");

    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    res.status(200).json(collector);
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add favorite /collectors/:collectorId/favorite
router.post("/:collectorId/favorite", authenticateToken, async (req, res) => {
  try {
    const collectorId = req.params.collectorId;
    console.log("collector id:", collectorId);
    const { artworkId } = req.body.artworkInformation;
    const collector = await Collector.findById(collectorId);

    console.log("found collector:", collector);

    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    let favoriteArtworkIds = [];

    console.log("collector favorite art works", collector.favoriteArtworks);

    if (collector.favoriteArtworks && collector.favoriteArtworks.length > 0) {
      favoriteArtworkIds = collector.favoriteArtworks.map((artwork) =>
        artwork._id.toString()
      );
    }

    console.log("favorite artwork ids:", favoriteArtworkIds);

    if (favoriteArtworkIds.includes(artworkId)) {
      return res.status(400).json({ error: "Artwork already in favorites" });
    }

    console.log("artwork id:", artworkId);

    collector.favoriteArtworks.unshift(artworkId);

    await collector.save();

    res
      .status(200)
      .json(
        `Artwork ${artworkId} added to collector ${collectorId}'s favorites.`
      );
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// undo favorite /collectors/:collectorId/favorites/:artworkId
router.delete(
  "/:collectorId/favorites/:artworkId",
  authenticateToken,
  async (req, res) => {
    try {
      const collectorId = req.params.collectorId;
      const artworkId = req.params.artworkId;

      const collector = await Collector.findById(collectorId);

      if (!collector) {
        return res.status(404).json({ error: "Collector not found" });
      }

      const favoriteIndex = collector.favoriteArtworks.indexOf(artworkId);

      if (favoriteIndex === -1) {
        return res.status(400).json({ error: "Artwork is not in favorites" });
      }

      collector.favoriteArtworks.splice(favoriteIndex, 1);

      await collector.save();

      res
        .status(200)
        .json(
          `Artwork ${artworkId} removed from collector ${collectorId}'s favorites.`
        );
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// add follow
router.post("/:id/follow", authenticateToken, async (req, res) => {
  try {
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// undo follow
router.post("/:id/unfollow", authenticateToken, async (req, res) => {
  try {
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add an artist to a collector's collection
router.post("/:collectorId/collection", async (req, res) => {
  const { collectorId } = req.params;
  const { selectedArtistIds } = req.body;

  try {
    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ message: "Collector not found" });
    }

    console.log("collectorId:", collectorId);
    console.log("selected artist ids:", selectedArtistIds);

    for (const artistId of selectedArtistIds) {
      const existingCollection = await Collection.findOne({
        artist: artistId,
        collector: collectorId,
      });

      if (!existingCollection) {
        const collection = await Collection.create({
          shareWithGalleries: false,
          artist: artistId,
          collector: collectorId,
          artworksUploaded: [],
        });
        console.log("Created collection:", collection);
        collector.collection.unshift(collection._id);
      } else if (
        existingCollection &&
        existingCollection.artistDeletedFromCollection
      ) {
        existingCollection.artistDeletedFromCollection = false;
        await existingCollection.save();
      }

      if (!collector.followedArtists.includes(artistId)) {
        collector.followedArtists.unshift(artistId);
      }
    }

    await collector.save();

    const populatedCollector = await Collector.findById(collectorId)
      .populate("collection")
      .exec();

    res.status(200).json({
      message: "Artist added successfully",
      collection: populatedCollector.collection,
    });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch(
  "/:collectorId/collection/share_gallery_status",
  authenticateToken,
  async (req, res) => {
    const { collectionId, share } = req.body;

    try {
      const collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }

      const collector = await Collector.findById(req.params.collectorId);
      if (!collector) {
        return res.status(404).json({ message: "Collector not found" });
      }

      console.log("collection:", collection.artist);
      console.log("collector:", collector);

      if (!collector.collection.includes(collectionId)) {
        return res
          .status(400)
          .json({ message: "Collection does not belong to collector" });
      }

      console.log("Collection does belong to collector");
      console.log("share option:", share);

      collection.shareWithGalleries = share;
      await collection.save();

      res.status(200).json({
        message: "Collection share status updated successfully",
        collection,
      });
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// remove an artist from a collector's collection
router.patch(
  "/:collectorId/collection/:collectionId/remove_artist",
  async (req, res) => {
    const { collectorId, collectionId } = req.params;
    const { artistId } = req.body;

    console.log("collector id:", collectorId);
    console.log("collection id:", collectionId);
    console.log("artist id:", artistId);

    try {
      const collection = await Collection.findById(collectionId);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      if (collection.collector.toString() !== collectorId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (collection.artist.toString() !== artistId) {
        return res
          .status(400)
          .json({ message: "Artist not associated with this collection" });
      }
      // remove the artist from the collection
      collection.artistDeletedFromCollection = true;
      await collection.save();

      // remove collectionId from collector's collection array
      // await Collector.findByIdAndUpdate(
      //   collectorId,
      //   { $pull: { collection: collectionId } },
      //   { new: true }
      // );

      res.status(200).json({
        message: "Artist removed from collection",
        collection,
      });
    } catch (error) {
      console.error("Error removing artist from collection:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// add an artwork to collector collection
const uploadImages = async (base64Images) => {
  try {
    const uploadPromises = base64Images.map((image) => {
      return cloudinary.uploader.upload(image, {
        folder: `collections-artwork-upload`,
        allowed_formats: ["jpg", "png", "heic"],
        height: 1000,
        crop: "limit",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    return uploadResults.map((result) => result.url);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

router.post("/:collectorId/collection/add-artwork", async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { uploadedImages, formData, selectedArtist, selectedArtwork } =
      req.body;

    let imageUrls = [];

    console.log("form data:", formData);

    if (selectedArtwork) {
      imageUrls.push(selectedArtwork.imageUrl);
    }

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    let followedArtists = collector.followedArtists.map((eachArtist) =>
      eachArtist.toString()
    );

    if (!selectedArtist && !formData.artistName) {
      return res.status(400).json({ error: "Artist selection is required" });
    }

    const normalizeName = (name) => name.toLowerCase().replace(/\s+/g, "");

    const sanitizedArtistName = normalizeName(formData.artistName);

    const existingArtists = await Artist.find();
    const normalizedExistingNames = existingArtists.map((artist) =>
      normalizeName(artist.name)
    );

    let newArtist;
    if (!selectedArtist) {
      if (normalizedExistingNames.includes(sanitizedArtistName)) {
        return res.status(400).json({ error: "Artist name already exists" });
      }
      newArtist = await Artist.create({
        name: formData.artistName,
      });
    }

    const base64values = uploadedImages
      ?.filter((eachImageBase64Value) => eachImageBase64Value.base64 !== "")
      .map((eachImageBase64Value) => eachImageBase64Value.base64);

    const uploadResults = await uploadImages(base64values);
    imageUrls = [...imageUrls, ...uploadResults];

    let collection = await Collection.findOne({
      collector: collectorId,
      artist: selectedArtist?._id || newArtist?._id,
    });
    if (!collection) {
      collection = await Collection.create({
        shareWithGalleries: false,
        artist: selectedArtist?._id || newArtist?._id,
        artistDeletedFromCollection: false,
        collector: collectorId,
        artworksUploaded: [],
      });
      collector.collection.push(collection._id);
    } else if (collection.artistDeletedFromCollection) {
      collection.artistDeletedFromCollection = false;
    }

    const newArtwork = {
      artist: selectedArtist?._id || newArtist?._id,
      artistName: formData.artistName,
      title: formData.title,
      medium: formData.medium,
      year: formData.year,
      materials: formData.materials,
      rarity: formData.rarity,
      dimensions: formData.dimensions,
      pricePaid: formData.pricePaid,
      provenance: formData.provenance,
      city: formData.city,
      notes: formData.notes,
      shareWithGalleries: formData.shareWithGalleries,
      uploadedPhotos: imageUrls,
    };

    collection.artworksUploaded.push(newArtwork);
    await collection.save();

    const artistIdToAdd = selectedArtist ? selectedArtist?._id : newArtist?._id;

    if (!followedArtists.includes(artistIdToAdd)) {
      collector.followedArtists.push(artistIdToAdd);
    }

    await collector.save();

    return res
      .status(200)
      .json({ message: "Artwork added to collection successfully", collector });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get collection artworks
router.get("/:collectorId/collection/artworks", async (req, res) => {
  try {
    const collectorId = req.params.collectorId;
    const collections = await Collection.find({
      collector: collectorId,
    })
      .populate("artist")
      .populate("collector");

    const filteredCollections = collections.filter(
      (collection) =>
        collection.artworksUploaded && collection.artworksUploaded.length > 0
    );

    return res.status(200).json(filteredCollections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get collection artwork
router.get(
  "/:collectorId/my-collection/artwork/:collectedArtworkId",
  async (req, res) => {
    try {
      const { collectorId, collectedArtworkId } = req.params;

      // İlgili koleksiyonu bul
      const collection = await Collection.findOne({
        collector: collectorId,
        "artworksUploaded._id": collectedArtworkId,
      }).populate("artist");

      if (!collection) {
        return res
          .status(404)
          .json({ error: "Collection or artwork not found" });
      }

      // Sanat eserini koleksiyon içerisinden bul
      const artwork = collection.artworksUploaded.id(collectedArtworkId);

      if (!artwork) {
        return res.status(404).json({ error: "Artwork not found" });
      }

      res.json({
        collection,
        artwork,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// edit exist uploaded collector artwork collection artwork
router.patch(
  "/:collectorId/collections/:collectionId/:collectedArtworkId/edit",
  async (req, res) => {
    try {
      const { collectorId, collectionId, collectedArtworkId } = req.params;
      const { formData, uploadedImages } = req.body;
      let imageUrls = [];

      if (formData?.uploadedPhotos?.length) {
        imageUrls = formData.uploadedPhotos;
      }

      console.log("collector id:", collectorId);
      console.log("collection id to edit:", collectionId);
      console.log("uploaded artwork id inside collection:", collectedArtworkId);

      console.log("new updated form data:", formData);
      console.log("new uploaded images:", uploadedImages);

      const collection = await Collection.findOne({
        collector: collectorId,
        _id: collectionId,
      });
      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

      const artwork = collection.artworksUploaded.find(
        (art) => art._id.toString() === collectedArtworkId
      );
      if (!artwork) {
        return res
          .status(404)
          .json({ error: "Artwork not found in collection" });
      }

      // upload images to cloudinary
      const base64values = uploadedImages
        ?.filter((eachImageBase64Value) => eachImageBase64Value.base64 !== "")
        .map((eachImageBase64Value) => eachImageBase64Value.base64);

      const uploadResults = await uploadImages(base64values);
      imageUrls = [...imageUrls, ...uploadResults];

      // Artwork güncelleme
      artwork.dimensions = formData.dimensions || artwork.dimensions;
      artwork.pricePaid = formData.pricePaid || artwork.pricePaid;
      artwork.artistName = formData.artistName || artwork.artistName;
      artwork.title = formData.title || artwork.title;
      artwork.medium = formData.medium || artwork.medium;
      artwork.year = formData.year || artwork.year;
      artwork.materials = formData.materials || artwork.materials;
      artwork.rarity = formData.rarity || artwork.rarity;
      artwork.provenance = formData.provenance || artwork.provenance;
      artwork.city = formData.city || artwork.city;
      artwork.notes = formData.notes || artwork.notes;
      artwork.uploadedPhotos = imageUrls.length
        ? imageUrls
        : artwork.uploadedPhotos;

      await collection.save();

      res
        .status(200)
        .json({ message: "Artwork updated successfully", artwork });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// delete exist uploaded collector artwork collection artwork
router.delete(
  "/:collectorId/collections/:collectionId/:collectedArtworkId/delete",
  async (req, res) => {
    try {
      const { collectorId, collectionId, collectedArtworkId } = req.params;

      const collection = await Collection.findById(collectionId);

      if (!collection) {
        return res.status(404).json({ error: "Collection not found" });
      }

      const artworkIndex = collection.artworksUploaded.findIndex(
        (artwork) => artwork._id.toString() === collectedArtworkId
      );

      if (artworkIndex === -1) {
        return res
          .status(404)
          .json({ error: "Artwork not found in collection" });
      }

      collection.artworksUploaded.splice(artworkIndex, 1);

      await collection.save();

      return res.status(200).json({
        message: "Collected artwork deleted from collection successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
