const Listing = require("../models/listing")
const Review = require("../models/review")

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
    if(!currReview.author.equals(req.user._id)){
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}