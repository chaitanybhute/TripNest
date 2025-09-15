const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middeleware.js");
const userController = require("../controllers/users.js");

//render signup form
router.route("/signup")
    .get(userController.renderSignupForm)
    //signup
    .post(wrapAsync(userController.signup));

//Login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.Login);

//Logout
router.get("/logout", userController.Logout);

module.exports = router;
