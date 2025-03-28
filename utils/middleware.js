const Listing = require("../models/listing")
const Review = require("../models/review")
const ExpressError = require("../utils/ExpressError")
const { listingSchema, reviewSchema } = require("../schema");

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else {
        next()
    }
}

module.exports.validateListing = (req, res, next) => {
    // console.log(req.body);
    let result = listingSchema.validate(req.body.listing);
    // console.log(result);
    if (result.error) {
        if (result.value === undefined)
            throw new ExpressError(400, "Listing is required");
        else
            throw new ExpressError(400, result.error.details[0].message);
    }
    else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.currPath = req.originalUrl;
        req.flash("error", "Oops! You need to log in before creating a listing");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.currPath) {
        res.locals.currPath = req.session.currPath;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let foundListing = await Listing.findById(id)
    console.log("req.user : " + req.user._id.toString(), "...", "listing : " + foundListing.owner);
    if (!req.user._id.equals(foundListing.owner)) {
        req.flash("error", "You don't have permission to perform this operation");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;
    let currReview = await Review.findById(reviewId);
    console.log("currReview : " + currReview, "\n...\n", "currUser : " + req.user);
    if (!currReview.author.equals(req.user._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}