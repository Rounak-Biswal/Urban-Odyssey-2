const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body.user;
        const newUser = new User({ username, email });
        await User.register(newUser, password);
        req.flash("success", "User successfully registered");
        res.redirect("/listings");
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
        return next(err);
    });
    req.flash("Successfully logged out!!");
    res.redirect("/listings");
})
module.exports = router