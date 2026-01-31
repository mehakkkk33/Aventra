const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//REVIEWS
//POST ROUTE
router.post("/", validateReview ,wrapAsync(async (req, res) => {
  console.log(req.params.id);
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   console.log("New Review saved!");
   res.redirect(`/listings/${listing._id}`);
}));



//DELETE REVIEW ROUTE
router.delete("/:reviewId", wrapAsync(async(req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
})
);


module.exports = router;