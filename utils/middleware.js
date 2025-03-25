module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.flash("error", "Oops! You need to log in before creating a listing");
        return res.redirect("/users/login");
    }
    next();
}