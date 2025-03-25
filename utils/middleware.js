module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.currPath = req.originalUrl;
        req.flash("error", "Oops! You need to log in before creating a listing");
        return res.redirect("/users/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.currPath) {
        res.locals.currPath = req.session.currPath;
    }
    next()
}