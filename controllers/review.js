const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove review ID from listing's reviews array
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });

    // Delete actual review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");

    // Go back to same listing page
    res.redirect(`/listing/${id}`);
}