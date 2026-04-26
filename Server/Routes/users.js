const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const checkGuestAuth = require("../Middlewares/checkGuestAuth");
const upload = require("../Middlewares/multer");

const {
  notificationsAllGetter,
  notificationsMarkRead,
} = require("../Controllers/notificationsController");
const { followUser } = require("../Controllers/followController");
const { postGetOfOneUser } = require("../Controllers/postController");
const mongoose = require("mongoose");
const {
  logoutController,
  signInController,
  signUpController,
} = require("../Controllers/authController");
const { profileFetcher } = require("../Controllers/profileController");
const { loginLimiter } = require("../Middlewares/rateLimit");

// GET user by ID
router.get("/:userid", profileFetcher);

// STEP 1 — Basic signup: only email + password
// No profile pic or username yet — those come in /onboarding
router.post("/add", signUpController);

// STEP 2 — Onboarding: set fullName, username, bio, profilePic
// Then auto-sign them in and return a token
router.post("/onboarding", upload.single("profilePic"));

// SIGN IN
router.post("/signin",loginLimiter, signInController);

// LOGOUT
router.post("/logout", auth, logoutController);

router.get("/:userid/follow", auth, followUser);

router.get("/:userId/posts", checkGuestAuth, postGetOfOneUser);

router.get("/:userid/notifications", auth, notificationsAllGetter);

router.patch(
  "/:userid/notifications/:notifId/mark-read",
  auth,
  notificationsMarkRead,
);

module.exports = router;
