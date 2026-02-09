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
router.get("/new",isLoggedIn , ListingController.renderNewForm);


// CREATE ROUTE
router.post("/",validateListing,isLoggedIn ,
  wrapAsync(ListingController.createListing)
);


// SHOW ROUTE
router.get("/:id", wrapAsync(ListingController.showListing));


// EDIT ROUTE
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(ListingController.renderEditForm));


// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.updateListing));


// DELETE ROUTE
router.delete("/:id", isLoggedIn ,isOwner, wrapAsync(ListingController.destroyListing));


module.exports = router;
