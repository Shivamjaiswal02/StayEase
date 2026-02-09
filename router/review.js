const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewschema} = require('../schema');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { isLoggedIn, isReviewAuthor } = require('../middleware');
let reviewcontroller = require("../controller/review");

const validatereview = (req, res, next) => {
        let result = reviewschema.validate(req.body);
        if(result.error) {
            let msg = result.error.details.map(el => el.message).join(',');
            throw new ExpressError(400, msg);
        }
        else {
            next();
        }
    };

router.post('/',isLoggedIn,validatereview, wrapAsync(reviewcontroller.newreview));

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewcontroller.destroyreview));

module.exports = router;