// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError")
const listingSchema = require("./schema");

const app = express();

// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/UrbanOdyssey";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("Connection to DB successful"))
    .catch(err => console.log(err));

// Middleware Setup
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Logging Middleware
app.use((req, res, next) => {
    req.time = new Date(Date.now());
    console.log(`${req.method} request to ${req.path} at ${req.time}`);
    next();
});

// token authentication Middleware
const checkToken = (req, res, next) => {
    let { token } = req.query;
    if (token === "myToken") {
        return next();
    }
    throw new ExpressError(401, "Access Denied");
};

// Routes
app.get("/", (req, res) => {
    res.send("This is root directory");
});

app.get("/data", checkToken, (req, res) => {
    res.send("Data accessed successfully");
});

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

// Listings Routes
app.get("/listings",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/allListings", { allListings });
    }));

app.get("/listings/new", (req, res) => {
    res.render("listings/newListing");
});

app.get("/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let foundListing = await Listing.findById(id);
        res.render("listings/showListing", { foundListing });
    })
);

app.post("/listings/create",
    wrapAsync(async (req, res, next) => {
        console.log(req.body);
        let result = listingSchema.validate(req.body.listing);
        console.log(result)
        if (result.error) {
            throw new ExpressError(400, result.error.details[0].message);
        }

        const listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect("/listings");
    }));

app.get("/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let foundListing = await Listing.findById(id);
        res.render("listings/editListing", { foundListing });
    })
);

app.put("/listings/:id/update",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect("/listings");
    })
);

app.delete("/listings/:id/delete",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

//server side validation
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).json({ error: message });
});

//path not found error
app.use("*", (req, res) => {
    res.status(404).send("Page Not Found");
});

// Start the Server
app.listen(5600, () => console.log("Server live at port 5600"));
