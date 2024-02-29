const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapsync.js");
const{isloggedin,validatelisting,isOwner} = require("../middelware.js");
const multer = require("multer");
const{storage}= require("../cloudconfig.js")
const upload = multer({storage})

const listingcontroller = require("../controllers/listing.js")

//create route....//create request route
router.route("/")
.get(wrapasync (listingcontroller.index))
.post(isloggedin,upload.single("listing[image]"),validatelisting, wrapasync(listingcontroller.createListing));


//create new and create ruote..
router.get("/new",isloggedin,listingcontroller.renderNewform);

//create,update,delete request
router.route("/:id")
.get( wrapasync(listingcontroller.showListing))
.put(isloggedin,isOwner,upload.single("listing[image]"),validatelisting, wrapasync(listingcontroller.updateRoute))
.delete(isloggedin,isOwner,wrapasync (listingcontroller.deleteRoute));


 //edit route 
 router.get("/:id/edit",isloggedin,isOwner, wrapasync(listingcontroller.editListing));


 module.exports = router;