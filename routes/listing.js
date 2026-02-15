const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");

const { isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// ---------------- VALIDATION ----------------
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  }

  next();
};


// ---------------- INDEX + CREATE ----------------
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),   // Create upload
    validateListing,
    wrapAsync(ListingController.createListing)
  );


// ---------------- NEW FORM ----------------
router.get(
  "/new",
  isLoggedIn,
  ListingController.renderNewForm
);


// ---------------- SHOW + UPDATE + DELETE ----------------
router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))

  // 🔥 FIX ADDED HERE
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),   // Edit upload
    wrapAsync(ListingController.updateListing)
  )

  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
  );


// ---------------- EDIT FORM ----------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);


module.exports = router;
