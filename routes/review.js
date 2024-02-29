const express = require("express");
const router = express.Router({mergeParams:true});
// const listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapsync.js");
const ExpressError = require("../utils/expresserror.js");
// const review = require("../models/review.js");
const{isloggedin,validatereview,isReviewauthor} = require("../middelware.js")

const reviewController = require("../controllers/review.js")


 //review path post request
 router.post("/",isloggedin,validatereview,wrapasync(reviewController.createReview));

//Delete review route
router.delete("/:reviewid",isloggedin,isReviewauthor,wrapasync (reviewController.deleteReview))

module.exports = router;