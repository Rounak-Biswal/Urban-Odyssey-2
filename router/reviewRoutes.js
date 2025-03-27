const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require("../schema");
const { isLoggedIn, isOwner, isAuthor } = require("../utils/middleware")

//function to validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    else {
        next()
    }
}

//for reviews
//add new review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log(`new review added : ${newReview}`);
        req.flash("success", "New review added");
        res.redirect(`/listings/${id}`);
    }))

//delete review
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review successfully deleted");
        res.redirect(`/listings/${id}`);
    }))

module.exports = router;