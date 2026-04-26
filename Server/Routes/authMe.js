const express = require("express");
const router = express.Router();

const auth = require("../Middlewares/auth");

// router.get("/", async (req, res) => {
//   const posts = await Post.find().lean();
//   res.status(200).json(posts);
// });

router.post("/", auth, async (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
