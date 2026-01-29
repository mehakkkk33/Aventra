const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./Models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wandernest";

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// MIDDLEWARE (IMPORTANT ORDER)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// INDEX ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// NEW ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// CREATE ROUTE
app.post(
  "/listings",
  validateListing,
   wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show", { listing });
}));

// EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

// UPDATE ROUTE (FINAL FIX)
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);

  // if no new image URL, keep old one
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = listing.image;
  }

  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect("/listings");
});


// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing");
  res.redirect("/listings");
}));

//REVIEWS
//POST ROUTE
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async (req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   console.log("New Review saved!");
   res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
})
);


app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong!" : err.message;
  res.status(statusCode).render("error", { statusCode, message });
});


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
