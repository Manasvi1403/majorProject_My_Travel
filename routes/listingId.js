const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");

const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({storage})

router.route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showListing))
    // Update Route
    .put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.updateListing))
    // Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;