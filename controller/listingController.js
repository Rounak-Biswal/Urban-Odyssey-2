const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_KEY
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.showAllListings = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/allListings", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/newListing");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let foundListing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");
    if (!foundListing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/showListing", { foundListing });
}

module.exports.createListing = async (req, res, next) => {

    let resp = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}`,
        limit: 1
    }).send()


    let url = req.file.path;
    let { filename } = req.file;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: "Point",
        coordinates: resp.body.features[0].geometry.coordinates
    }
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Oops! You need to log in before editing a listing");
        res.redirect("/users/login");
    }

    let { id } = req.params;
    let foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings");
    }
    let orgImgUrl = foundListing.image.url;
    orgImgUrl = orgImgUrl.replace("/upload", "/upload/w_250");
    res.render("listings/editListing", { foundListing, orgImgUrl });
}

module.exports.editListing = async (req, res) => {
    console.log("Uploaded File:", req.file);

    let { id } = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let url = req.file.path;
        let { filename } = req.file;
        newListing.image = { url, filename };
        await newListing.save();
    }

    req.flash("success", "Listing succcessfully updated !!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Oops! You need to log in before deleting a listing");
        res.redirect("/users/login");
    }

    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing succcessfully deleted !!");
    res.redirect("/listings");
}