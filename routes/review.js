const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/review")

const {
    isLoggedIn,
    validateReview,
    isReviewCreater
} = require("../middleware");

const Listing = require("../models/listing");
const Review = require("../models/reviews");

// Reviews Route - Add Review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Review Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewCreater, wrapAsync(reviewController.destroyReview));

module.exports = router;