const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.newreview = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    // console.log(newreview);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","review added");
    res.redirect(`/listings/${listing._id}`);
    console.log("review added");
};

module.exports.destroyreview = async (req, res) => {
        let {id, reviewId} = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted");
        res.redirect(`/listings/${id}`);
        console.log("review deleted");
};