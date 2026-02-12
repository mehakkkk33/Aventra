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


router.route("/")
.get(wrapAsync(ListingController.index))
.post(validateListing,isLoggedIn ,
  wrapAsync(ListingController.createListing)
);

// NEW ROUTE
router.get("/new",isLoggedIn , ListingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put( isLoggedIn, isOwner, wrapAsync(ListingController.updateListing))
.delete( isLoggedIn ,isOwner, wrapAsync(ListingController.destroyListing));

// EDIT ROUTE
router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(ListingController.renderEditForm));




module.exports = router;
