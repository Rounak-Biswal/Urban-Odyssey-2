// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");

// Routers
const routesForListings = require("./router/listingRoutes");
const routesForReviews = require("./router/reviewRoutes");

const app = express();

// Database Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/UrbanOdyssey";
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Middleware Setup
app.engine("ejs", ejsMate); // Setting EJS as templating engine with ejs-mate for layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method")); // For PUT & DELETE requests
app.use(express.static(path.join(__dirname, "public"))); // Serving static files

// Logging Middleware (For Debugging)
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.path} at ${new Date().toLocaleString()}`);
    next();
});

// Token Authentication Middleware (Example for protected routes)
const checkToken = (req, res, next) => {
    let { token } = req.query;
    if (token === "myToken") {
        return next();
    }
    throw new ExpressError(401, "Access Denied");
};

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to UrbanOdyssey");
});

app.get("/data", checkToken, (req, res) => {
    res.send("Data accessed successfully");
});

// Mounting Routers
app.use("/listings", routesForListings);
app.use("/listings/:id/reviews", routesForReviews);

// Error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { message, status });
});


// 404 Handler (Page Not Found)
app.use("*", (req, res) => {
    res.status(404).send("Page Not Found");
});

// Start the Server
const PORT = 5600;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
