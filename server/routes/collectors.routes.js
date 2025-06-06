const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const Collector = require("../models/Collector.model");
const Collection = require("../models/Collection.modal");
const Favorite = require("../models/Favorite.model");
const Artist = require("../models/Artist.model");
const Order = require("../models/Order.model");
const cloudinary = require("../utils/Cloudinary");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    const { artworkId } = req.body.artworkInformation;
    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    let favoriteArtworkIds = [];

    if (collector.favoriteArtworks && collector.favoriteArtworks.length > 0) {
      favoriteArtworkIds = collector.favoriteArtworks.map((artwork) =>
        artwork._id.toString()
      );
    }

    if (favoriteArtworkIds.includes(artworkId)) {
      return res.status(400).json({ error: "Artwork already in favorites" });
    }

    collector.favoriteArtworks.unshift(artworkId);

    await Favorite.create({
      favoritedArtwork: artworkId,
      collector: collectorId,
    });

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

      await Favorite.deleteOne({
        favoritedArtwork: artworkId,
        collector: collectorId,
      });

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

      if (!collector.collection.includes(collectionId)) {
        return res
          .status(400)
          .json({ message: "Collection does not belong to collector" });
      }

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
        width: 1920, // For large screens, ensure the image width is sufficient
        // height: 200, // Match your CSS maxHeight
        height: 1920, // Match your CSS maxHeight
        crop: "fill", // To fill the space and ensure no white space
        gravity: "auto", // To let Cloudinary auto-crop based on content
        quality: "auto:good", // Adjust the quality for performance optimization
        fetch_format: "jpg",
        format: "jpg",
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
        : formData?.uploadedPhotos
        ? formData.uploadedPhotos
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

// get saves
router.get("/:collectorId/saves", async (req, res) => {
  const { collectorId } = req.params;

  try {
    // Favori eserleri `Favorite` koleksiyonundan alın
    const favorites = await Favorite.find({ collector: collectorId })
      .populate("favoritedArtwork")
      .populate("collector")
      .populate({
        path: "favoritedArtwork",
        populate: {
          path: "artist",
          model: "Artist",
        },
      });

    if (favorites.length === 0) {
      return res
        .status(404)
        .json({ error: "No favorite artworks found for this collector" });
    }

    // Favori eserleri içeren veriyi client'a gönderin
    res.json({
      favoriteArtworks: favorites.map((fav) => fav),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get followed artists
router.get("/:collectorId/followed-artists", async (req, res) => {
  const { collectorId } = req.params;

  try {
    const collector = await Collector.findById(collectorId).populate(
      "followedArtists"
    );

    if (!collector) {
      return res.status(404).json({ error: "Collector not found!" });
    }

    res.json({
      followedArtists: collector.followedArtists,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// change profile image
router.post("/:collectorId/change_profile_image", async (req, res) => {
  try {
    const { image } = req.body;
    const collectorId = req.params.collectorId;

    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).json({ errorMessage: "COLLECTOR NOT FOUND!" });
    }

    if (image) {
      const imageInfo = await cloudinary.uploader.upload(image, {
        folder: "art_bazaar/profile_images",
        allowed_formats: ["ogv", "jpg", "png", "webm", "webp"],
        gravity: "face",
        // width: 133,
        // height: 133,
        radius: "max",
        crop: "fill",
        quality: "auto:good",
        fetch_format: "jpg",
        format: "jpg",
      });

      collector.profileImage = imageInfo.url;
      await collector.save();

      return res.status(200).json({ imageInfo: imageInfo });
    } else {
      return res.status(400).json({ errorMessage: "Image is required!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// collector edit-profile
router.patch(
  "/:collectorId/edit-profile",
  authenticateToken,
  async (req, res) => {
    try {
      const { formData } = req.body;
      const { collectorId } = req.params;

      let updateData = {};

      if (formData.profileImage)
        updateData.profileImage = formData.profileImage;
      if (formData.collectorName) updateData.name = formData.collectorName;
      if (formData.primaryLocation)
        updateData.location = formData.primaryLocation;
      if (formData.profession) updateData.profession = formData.profession;
      if (formData.otherRelevantPosition)
        updateData.otherRelevantPosition = formData.otherRelevantPosition;
      if (formData.about) updateData.about = formData.about;
      if (formData.collectorEmail) updateData.email = formData.collectorEmail;
      if (formData.collectorMobile)
        updateData.mobileNumber = formData.collectorMobile;
      if (formData.priceRange) updateData.priceRange = formData.priceRange;

      const updatedCollector = await Collector.findByIdAndUpdate(
        collectorId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedCollector) {
        return res.status(404).json({ errorMessage: "Collector not found!" });
      }

      return res.status(200).json({
        message: "Collector profile updated successfully",
        updatedCollector,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// check password correct EXTRA route no need
router.post("/:collectorId/password-check", async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { currentPassword } = req.body;

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ errorMessage: "Collector not found!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, collector.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errorMessage: "Incorrect current password" });
    }

    return res.status(200).json({ message: "Password is correct" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// collector change password
router.patch(`/:collectorId/change-password`, async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { changePasswordFormData, currentPassword } = req.body;

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ errorMessage: "Collector not found!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, collector.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errorMessage: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordFormData.NewPassword,
      saltRounds
    );

    collector.password = hashedPassword;
    await collector.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete account
router.post(`/:collectorId/delete-account`, async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { formData } = req.body;

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ errorMessage: "Collector not found!" });
    }

    const isMatch = await bcrypt.compare(formData.password, collector.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errorMessage: "Incorrect current password" });
    }

    await Collector.findByIdAndDelete(collectorId);

    await Artist.updateMany(
      { followers: collectorId },
      { $pull: { followers: collectorId } }
    );

    const artistsToDelete = await Artist.find({
      collectorProfile: collectorId,
    });
    for (const artist of artistsToDelete) {
      await artist.remove();
    }

    await Collection.deleteMany({ collector: collectorId });

    await Favorite.deleteMany({ collector: collectorId });

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// collector add delivery address
router.post("/:collectorId/add-delivery-address", async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { formData } = req.body;

    const newDeliveryAddress = {
      fullName: formData.fullName,
      country: formData.country,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state_provinence_or_region: formData.state_provinence_or_region,
      postalCode: formData.postalCode,
      phoneNumber: formData.phoneNumber,
      settedAsDefault: formData.settedAsDefault,
    };

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    if (newDeliveryAddress.settedAsDefault) {
      collector.deliveryAddresses.forEach((address) => {
        address.settedAsDefault = false;
      });
    }

    collector.deliveryAddresses.unshift(newDeliveryAddress);
    await collector.save();

    res.json(collector);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// collector toggle default delivery address
router.patch(
  "/:collectorId/:deliveryAddressId/toggle-default-status",
  async (req, res) => {
    try {
      const { collectorId, deliveryAddressId } = req.params;

      const collector = await Collector.findById(collectorId);
      if (!collector) {
        return res.status(404).json({ error: "Collector not found" });
      }
      collector.deliveryAddresses.forEach((address) => {
        if (address._id.toString() === deliveryAddressId) {
          address.settedAsDefault = true;
        } else {
          address.settedAsDefault = false;
        }
      });

      await collector.save();

      res.json({
        message: "Default delivery address toggled successfully",
        collector,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// collector edit exist delivery address
router.patch("/:collectorId/:deliveryAddressId/edit", async (req, res) => {
  try {
    const { collectorId, deliveryAddressId } = req.params;
    const { formData } = req.body;

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    const addressIndex = collector.deliveryAddresses.findIndex(
      (address) => address._id.toString() === deliveryAddressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Delivery address not found" });
    }
    collector.deliveryAddresses[addressIndex] = {
      ...collector.deliveryAddresses[addressIndex]._doc,
      ...formData,
    };

    await collector.save();

    res.json(collector);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// collector delete existing delivery address
router.delete("/:collectorId/:deliveryAddressId/delete", async (req, res) => {
  try {
    const { collectorId, deliveryAddressId } = req.params;

    const collector = await Collector.findById(collectorId);
    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    const addressIndex = collector.deliveryAddresses.findIndex(
      (address) => address._id.toString() === deliveryAddressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: "Delivery address not found" });
    }

    collector.deliveryAddresses.splice(addressIndex, 1);

    await collector.save();

    res.json({ message: "Delivery address deleted successfully", collector });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get orders
router.get("/:collectorId/orders", async (req, res) => {
  try {
    const { collectorId } = req.params;

    const orders = await Order.find({ collectorId: collectorId })
      .populate("artworkToPurchase")
      .populate({
        path: "artworkToPurchase",
        populate: {
          path: "artist",
          model: "Artist",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get conversations for a collector Work In ProgressEvent...
router.get("/:collectorId/conversations", async (req, res) => {
  try {
    const { collectorId } = req.params;

    const collector = await Collector.findById(collectorId);

    if (!collector) {
      return res.status(404).json({ error: "Collector not found" });
    }

    res.status(200).json(collector.conversations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
