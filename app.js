// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError")

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
        const listing = new Listing(req.body.listing);
        await listing.save();
        res.redirect("/listings");
        next(err);
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

// Error Handling Middleware
// app.use((err, req, res, next) => {
//     console.log("-------Error---------");
//     let { status = 500, msg = "Something went wrong" } = err;
//     res.status(status).send(msg);
// });

// 404 Middleware (Must be Last)
// app.use((req, res, next) => {
//     res.status(404).send("404, no route exists");
// });

//server side validation
// app.use((err, req, res, next) => {
//     let { status, message } = err;
//     res.status(status).send(message);
// })
app.use((err, req, res, next) => {
    console.log(err); // Log the error for debugging

    if (!err.status) err.status = 500; // Default to 500 if no status is set

    res.status(err.status).send(err.message);
});


//path not found error
app.use("*", (err, req, res, next) => {
    // next(new ExpressError(404, "Page Not Found"));
    res.status(404).send("Page Not Found")
})

// Start the Server
app.listen(5600, () => console.log("Server live at port 5600"));
