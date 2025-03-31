const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, isLoggedIn, isOwner } = require("../utils/middleware");
const { showAllListings, renderNewForm, showListing, createListing, renderEditForm, editListing, deleteListing } = require("../controller/listingController")
const multer = require("multer")
const { storage } = require("../cloudConfig")
const upload = multer({ storage })

// Listings Routes
router.get("/", wrapAsync(showAllListings));

router.get("/new", isLoggedIn, renderNewForm);

router.get("/:id", wrapAsync(showListing));

// router.post("/create", isLoggedIn, validateListing, wrapAsync(createListing));
router.post("/create", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

// router.put("/:id/update", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(editListing));
router.put("/:id/update", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(editListing));


router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router