// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Set up view engine and middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/UrbanOdyssey";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => console.log("Connection to DB successful"))
    .catch(err => console.log(err));

// Start the server
app.listen(5600, () => console.log("Server live at port 5600"));

// Root route
app.get("/", (req, res) => {
    res.send("This is root directory");
});

// Test route to save a sample listing
app.get("/testing", async (req, res) => {
    let sample = new Listing({
        title: "Vintage Villa",
        desc: "England style living",
        location: "California",
        country: "United States"
    });
    await sample.save();
    console.log("Sample was saved");
    res.send("Testing successful");
});

//display all listings
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/allListings", { allListings });
});

// Route to show form for creating a new listing
app.get("/listings/new", (req, res) => {
    res.render("listings/newListing");
});

// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let foundListing = await Listing.findById(id);
    res.render("listings/showListing", { foundListing });
});

// create a new listing
app.post("/listings/create", async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
});

// Route to show form for editing a listing
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let foundListing = await Listing.findById(id);
    res.render("listings/editListing", { foundListing });
});

// update route
app.put("/listings/:id/update", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});

// delete route
app.delete("/listings/:id/delete", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
