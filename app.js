// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

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

//session midleware setup
app.use(session({
    secret: "MrCupCake",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

//flash
app.use(flash());

// Token Authentication Middleware (Example for protected routes)
const checkToken = (req, res, next) => {
    let { token } = req.query;
    if (token === "myToken") {
        return next();
    }
    throw new ExpressError(401, "Access Denied");
};

//middleware to store flash messages
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// Routes
//playing with session
app.get("/register", (req, res) => {
    let { name = "unknown" } = req.query;
    req.session.name = name;
    if (req.session.name == "unknown") {
        req.flash("error", "user not registered");
    }
    else {
        req.flash("success", `${req.session.name} successfully registered`);
    }
    res.redirect("/greet")
})

app.get("/greet", (req, res) => {
    res.render("flashMsg.ejs", { name: req.session.name });
})

//root route
app.get("/", (req, res) => {
    if (req.session.count) {
        req.session.count++
    }
    else {
        req.session.count = 1
    }
    res.send(`Welcome to UrbanOdyssey, you've visited ${req.session.count} times`);
});

//cookie testing
app.get("/addCookies", (req, res) => {
    res.cookie("name", "Rounak");
    res.send("done !!");
})

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
