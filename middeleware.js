const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in to perform this action." });
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: "Listing not found." });
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        return res.status(403).json({ error: "You are not the owner of this listing." });
    }

    next();
};

module.exports.validateListing = (req, res, next) => {
    // When coming from multipart/form-data, fields are strings in req.body
    // The React frontend sends: listing[title], listing[description], etc.
    // Wrap body under "listing" key if not already wrapped
    const bodyToValidate = req.body.listing
        ? req.body
        : { listing: req.body };

    let { error } = listingSchema.validate(bodyToValidate);

    if (error) {
        throw new ExpressError(400, error.details.map(d => d.message).join(", "));
    } else {
        // Normalise: ensure req.body.listing exists for the controller
        if (!req.body.listing) {
            req.body = { listing: req.body };
        }
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const bodyToValidate = req.body.review
        ? req.body
        : { review: req.body };

    let { error } = reviewSchema.validate(bodyToValidate);

    if (error) {
        throw new ExpressError(400, error.details.map(d => d.message).join(", "));
    } else {
        if (!req.body.review) {
            req.body = { review: req.body };
        }
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({ error: "Review not found." });
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        return res.status(403).json({ error: "You are not the author of this review." });
    }

    next();
};