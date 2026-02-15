const Listing = require("../Models/listing");


// INDEX — Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};


// NEW — Render new listing form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};


// SHOW — Show single listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash(
      "error",
      "Listing which you are trying to reach does not exist!"
    );
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};


// CREATE — Create new listing
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);

  // 🔥 FIX ADDED — Save owner of listing
  newListing.owner = req.user._id;

  // Save image
  newListing.image = { url, filename };

  await newListing.save();

  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};


// EDIT — Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};


// UPDATE — Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);

  // IMAGE FALLBACK LOGIC
  // If user didn't give new image → keep old image
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = listing.image;
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};


// DELETE — Destroy listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);

  console.log("Deleted Listing");

  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
