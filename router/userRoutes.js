const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup")
})

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body.user;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);         //data is saved to DB i.e signup successful
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "user successfully logged in")
            res.redirect("/listings");
        })               //automatical login upon signup
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
}))

router.get("/login", (req, res) => {
    res.render("users/login")
})

router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "User successfuly logged in");
        res.redirect("/listings");
    }
)

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); // Pass error to Express error handler
        req.flash("success", "Successfully logged out!!");
        res.redirect("/listings");
    });
});


module.exports = router