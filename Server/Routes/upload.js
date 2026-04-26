const upload = require("../Middlewares/multer");
const auth = require("../Middlewares/auth");
const express = require("express");
const router = express.Router();
const cloudinaryUpload = require("../config/cloudinary");

router.post("/upload", auth, upload.single("photo"), async (req, res) => {
  try {
    const { url, secure_url } = await cloudinaryUpload(req.file?.path);
    res.status(200).json({ url: secure_url || url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
