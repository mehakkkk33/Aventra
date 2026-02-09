const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.renderLoginForm);

router.post("/login", passport.authenticate("local", {failureRedirect: '/login' , failureFlash: true}) , userController.login)


router.get("/logout", userController.logout);

module.exports = router;