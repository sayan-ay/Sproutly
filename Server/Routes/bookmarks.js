const {
  allBookmarksGetter,
  createBookmark,
  deleteBookmark,
} = require("../Controllers/bookmarkController");
const auth = require("../Middlewares/auth");
const express = require("express");
const router = express.Router();

router.get("/", auth, allBookmarksGetter);

router.post("/:postId", auth, createBookmark);

router.delete("/:postId", auth, deleteBookmark);

module.exports = router;
