const Listing = require("./Models/listing");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the path they were trying to visit
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

// Save the redirect URL to locals so Passport doesn't delete it
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Check if the current user owns the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Guard clause: Check if listing exists and has an owner
    if (!listing || !listing.owner) {
        req.flash("error", "Listing not found or has no owner.");
        return res.redirect("/listings");
    }

    // Check if current user is the owner
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};