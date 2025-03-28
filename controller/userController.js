const User = require("../models/user");

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login")
}

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup")
}

module.exports.signup = async (req, res, next) => {
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
}

module.exports.login = async (req, res) => {
    req.flash("success", "User successfuly logged in");
    // res.redirect("/listings");
    let redirectUrl = res.locals.currPath || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); // Pass error to Express error handler
        req.flash("success", "Successfully logged out!!");
        res.redirect("/listings");
    });
}