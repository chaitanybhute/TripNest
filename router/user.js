const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middeleware.js");
const userController = require("../controllers/users.js");

// Signup
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login — on failure return JSON 401 instead of redirect
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        (req, res, next) => {
            passport.authenticate("local", (err, user, info) => {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).json({ error: info?.message || "Invalid username or password." });
                }
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    return userController.Login(req, res, next);
                });
            })(req, res, next);
        }
    );

// Logout
router.get("/logout", userController.Logout);

module.exports = router;
