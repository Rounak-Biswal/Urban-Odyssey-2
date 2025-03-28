const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../utils/middleware")
const passport = require("passport");
const { signup, renderLoginForm, renderSignupForm, logout, login } = require("../controller/userController");

router.get("/signup", renderSignupForm)

router.post("/signup", wrapAsync(signup))

router.get("/login", renderLoginForm)

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: true
    }),
    login
)

router.get("/logout", logout);

module.exports = router