const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingcontroller = require("../controller/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.newListing)
  );

router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontroller.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

module.exports = router;
