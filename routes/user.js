const express = require("express");
const router = express.Router();
const wrapsync = require("../utils/wrapsync.js");
const passport = require("passport");
const { saveredirecturl } = require("../middelware.js");

const userController = require ("../controllers/user.js")

//rendersignupform && usersignup
router.route("/signup")
.get( userController.renderSignupform)
.post( wrapsync(userController.userSignup));

//login route and login route with post request.
router.route("/login")
.get( userController.renderLoginform)
.post(
    saveredirecturl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }),userController.userLogin);


//logout route
router.get("/logout", userController.userlogout);


module.exports = router