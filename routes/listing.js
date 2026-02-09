const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");


const ListingController = require("../controllers/listing.js");


const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  }
  next();
};


// INDEX ROUTE
router.get("/", wrapAsync(ListingController.index));


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
  const listing = await Listing.findById(id)
  .populate({path : "reviews", populate:{
    path: "author",
  }})
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing which you are trying to reach does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
}));


// EDIT ROUTE
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));


// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  // 2. IMAGE FALLBACK LOGIC
  // If the user didn't provide a new image URL, keep the old one
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = listing.image;
  }
  // 3. Perform the update
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
}));
// DELETE ROUTE
router.delete("/:id", isLoggedIn ,isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing");
  req.flash("success", " Listing deleted!");
  res.redirect("/listings");
}));


module.exports = router;
