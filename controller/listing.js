const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let alllisting = await Listing.find({});
  res.render("index.ejs", { alllisting });
};

module.exports.renderNewForm = (req, res) => {
  res.render("form.ejs");
};

module.exports.newListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Added");
  res.redirect("/listings/");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does not exists!");
    res.redirect("/listings/");
  }
  res.render("show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does not exists!");
    res.redirect("/listings/");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("edit.ejs", { listing, originalImageUrl });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}/`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings/");
};
