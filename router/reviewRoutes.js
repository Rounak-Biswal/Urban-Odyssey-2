const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isOwner, isAuthor } = require("../utils/middleware");
const { addReview, deleteReview } = require("../controller/reviewController");

//for reviews
//add new review
router.post("/", isLoggedIn, validateReview, wrapAsync(addReview))

//delete review
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(deleteReview))

module.exports = router;