const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const reviewController = require("../controllers/reviews.js");

//REVIEWS
//POST ROUTE
router.post("/",isLoggedIn, validateReview ,wrapAsync(reviewController.createReview));



//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.destroyReview));


module.exports = router;
