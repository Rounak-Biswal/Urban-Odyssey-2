const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../utils/middleware")
const passport = require("passport");
const { signup, renderLoginForm, renderSignupForm, logout, login } = require("../controller/userController");

router
    .route("/signup")
    .get(renderSignupForm)
    .post(wrapAsync(signup))

router
    .route("/login")
    .get(renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true
        }),
        login
    )

router.get("/logout", logout);

module.exports = router