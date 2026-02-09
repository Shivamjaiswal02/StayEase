const Listing = require("./models/listing");
const ExpressError = require('./utils/ExpressError');
const {listingschema} = require('./schema');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }
    next();
};
// post-login middleware to save redirect url
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// middleware to check if the current user is the owner of the listing
module.exports.isowner = async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
        let result = listingschema.validate(req.body);
        if(result.error) {
            let msg = result.error.details.map(el => el.message).join(',');
            throw new ExpressError(400, msg);
        }
    next();
};


module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId}=req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }
    next();
};