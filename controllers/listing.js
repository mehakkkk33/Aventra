const Listing= require("../Models/listing");



module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
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
};


module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", " New listing created successfully!");
    res.redirect("/listings");
  };


  module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};


module.exports.updateListing = async (req, res) => {
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
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Deleted Listing");
  req.flash("success", " Listing deleted!");
  res.redirect("/listings");
};