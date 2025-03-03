// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError")

//routers
const routesForListings = require("./router/listingRoutes");
const routesForReviews = require("./router/reviewRoutes");

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

app.use("/listings", routesForListings);
app.use("/listings/:id/reviews", routesForReviews);


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
