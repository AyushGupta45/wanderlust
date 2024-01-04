const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewcontroller = require("../controller/reviews.js");

const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");

//review route
//post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewcontroller.postReview)
);

//delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewcontroller.destroyReview)
);

module.exports = router;
