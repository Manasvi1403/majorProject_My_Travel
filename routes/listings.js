const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({storage})

router.get("/search", wrapAsync(listingController.searchListings));

router.route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // Create Route
    .post(isLoggedIn, upload.single('listing[image][url]'), validateListing,wrapAsync(listingController.createListing));

// New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


module.exports = router;