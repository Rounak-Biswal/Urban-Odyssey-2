module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Oops! You need to log in before creating a listing");
        res.redirect("/users/login");
    }
    next();
}