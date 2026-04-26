const express = require("express");
const router = express.Router();

const checkGuestAuth = require("../Middlewares/checkGuestAuth");
const auth = require("../Middlewares/auth");

const {
  postAdder,
  getAllPosts,
  getASinglePost,
} = require("../Controllers/postController");

router.get("/", checkGuestAuth, getAllPosts);

router.post("/add", auth, postAdder);

router.get("/:postId", checkGuestAuth, getASinglePost);

module.exports = router;
