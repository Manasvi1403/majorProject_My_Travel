const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =  process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.searchListings = async (req, res) => {
    const location = req.query.location?.trim();

    if (!location) {
        return res.redirect("/listings");
    }

    const safeLocation = location.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const allListings = await Listing.find({
        $or: [
            { country: { $regex: safeLocation, $options: "i" } },
            { location: { $regex: safeLocation, $options: "i" } }
        ]
    });

    res.render("Listings/index.ejs", {
    allListing: allListings,
    location
    });
};


module.exports.index = async (req, res) => {
    const { category } = req.query;
    let filter = {};

    if (category && category !== "Trending") {
        filter.category = category;
    }

    const allListing = await Listing.find(filter);

    res.render("Listings/index.ejs", { allListing });
};


module.exports.renderNewForm = async (req, res) => {
    res.render("Listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "createdBy" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing You Requested For Doesn't Exist!");
        return res.redirect("/listings");
    }

    res.render("Listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res) => {
    let responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    if (!responce.body.features.length) {
        req.flash("error", "Location not found!");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.geometry = responce.body.features[0].geometry;
    
    newListing.owner = req.user._id;

    let savedListing = await newListing.save();
    console.log("Saved geometry:", savedListing.geometry);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing You Requested For Doesn't Exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("Listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing");
    }

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing }
    );
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}