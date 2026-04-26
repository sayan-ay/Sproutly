const Comment = require("../Models/comment");
const auth = require("../Middlewares/auth");
const express = require("express");
const router = express.Router();
const {commentAddToPost,getCommentsOfOnePost,getCommentsOfOneUser}=require("../Controllers/commentsController");

router.post("/add/:postid", auth, commentAddToPost);

router.get("/:postid", getCommentsOfOnePost);

router.get("/user/:userid", getCommentsOfOneUser);

module.exports = router;
