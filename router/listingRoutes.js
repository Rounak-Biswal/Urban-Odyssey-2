const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError")
const { listingSchema } = require("../schema");

//function to validate new listing
const validateListing = (req, res, next) => {
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

// Listings Routes
router.get("/",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/allListings", { allListings });
    }));

router.get("/new", (req, res) => {
    res.render("listings/newListing");
});

router.get("/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let foundListing = await Listing.findById(id).populate("reviews");
        if(!foundListing){
            req.flash("error", "Listing doesn't exist");
            res.redirect("/listings");
        }
        res.render("listings/showListing", { foundListing });
    })
);

router.post("/create",
    validateListing,
    wrapAsync(async (req, res, next) => {
        const listing = new Listing(req.body.listing);
        await listing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    }));

router.get("/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let foundListing = await Listing.findById(id);
        if(!foundListing){
            req.flash("error", "Listing doesn't exist");
            res.redirect("/listings");
        }
        res.render("listings/editListing", { foundListing });
    })
);

router.put("/:id/update",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing succcessfully updated !!");
        res.redirect(`/listings/${id}`);
    })
);

router.delete("/:id/delete",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing succcessfully deleted !!");
        res.redirect("/listings");
    })
);

module.exports = router