const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn} = require("../middleware.js");


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};


// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));


// NEW ROUTE
router.get("/new",isLoggedIn ,(req, res) => {
  res.render("listings/new");
});


// CREATE ROUTE
router.post(
  "/",
  validateListing,isLoggedIn ,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", " New listing created successfully!");
    res.redirect("/listings");
  })
);


// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if(!listing){
    req.flash("error", "Listing which you are trying to reach does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));


// EDIT ROUTE
router.get("/:id/edit",isLoggedIn , wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));


// UPDATE ROUTE
router.put("/:id", isLoggedIn ,wrapAsync(async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  // keep old image if new not provided
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = listing.image;
  }

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "  Listing updated successfully!");
  res.redirect("/listings");
}));


// DELETE ROUTE
router.delete("/:id", isLoggedIn ,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing");
  req.flash("success", " Listing deleted!");
  res.redirect("/listings");
}));


module.exports = router;
