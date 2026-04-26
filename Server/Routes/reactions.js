const express = require("express");
const router = express.Router();
const auth = require("../Middlewares/auth");
const Post = require("../Models/post");
const Reaction = require("../Models/reaction");
const Comment = require("../Models/comment");
const Notification = require("../Models/notification");
const { emitToOneUser } = require("../config/socket");
const mongoose = require("mongoose");

router.patch("/comments/:commentId", auth, async (req, res) => {
  let notifNeeded = false;
  const { reaction } = req.body;
  const commentId = req.params.commentId;
  const userId = req.user._id;
  if (!commentId)
    return res.status(400).json({ message: "comment ID is required" });
  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: "comment not found" });
  if (!reaction || !["LIKE", "DISLIKE"].includes(reaction))
    return res.status(400).json({ message: "Invalid reaction" });
  const alreadyReacted = await Reaction.findOne({
    targetType: "Comment",
    targetId: commentId,
    userId,
  });

  if (alreadyReacted) {
    if (alreadyReacted.reaction === reaction)
      await Reaction.findByIdAndDelete(alreadyReacted._id);
    else {
      await Reaction.findByIdAndUpdate(alreadyReacted._id, { reaction });
      notifNeeded = true;
    }
  } else {
    try {
      await Reaction.create({
        targetId: commentId,
        userId: userId,
        targetType: "Comment",
        reaction,
      });
      notifNeeded = true;
    } catch (error) {
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }
  if (notifNeeded && comment.commentedBy.toString() !== userId.toString()) {
    try {
      const notif = await Notification.create({
        notifType: reaction,
        sender: userId,
        reciever: comment.commentedBy,
        targetId: comment.onWhichPost,
        commentId: comment._id,
        targetType: "Post",
      });

      const payload = await Notification.findById(notif._id)
        .populate({ path: "sender", select: "-email -password -bio -fullname" })
        .select("-reciever")
        .lean();

      emitToOneUser(comment.commentedBy, "notification-add", payload);
    } catch (error) {
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }

  return res.status(200).json({ message: `Success` });
});

router.patch("/posts/:postId", auth, async (req, res) => {
  let notifNeeded = false;
  const { reaction } = req.body;
  const postId = req.params.postId;
  const userId = req.user._id;
  if (!postId) return res.status(400).json({ message: "Post ID is required" });
  const post = await Post.findOne({ _id: postId });
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!reaction || !["LIKE", "DISLIKE"].includes(reaction))
    return res.status(400).json({ message: "Invalid reaction" });
  const alreadyReacted = await Reaction.findOne({
    targetType: "Post",
    targetId: postId,
    userId,
  });

  if (alreadyReacted) {
    if (alreadyReacted.reaction === reaction)
      await Reaction.findByIdAndDelete(alreadyReacted._id);
    else {
      await Reaction.findByIdAndUpdate(alreadyReacted._id, { reaction });
      notifNeeded = true;
    }
  } else {
    try {
      await Reaction.create({
        targetId: postId,
        userId: userId,
        targetType: "Post",
        reaction,
      });
      notifNeeded = true;
    } catch (error) {
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }
  if (notifNeeded && userId.toString() !== post.author.toString()) {
    try {
      const notif = await Notification.create({
        notifType: reaction,
        sender: userId,
        reciever: post.author,
        targetId: postId,

        targetType: "Post",
      });

      const payload = await Notification.findById(notif._id)
        .populate({ path: "sender", select: "-email -password -bio -fullname" })
        .select("-reciever")
        .lean();

      emitToOneUser(post.author, "notification-add", payload);
    } catch (error) {
      return res.status(500).json({ error: error.message, code: error.code });
    }
  }

  return res.status(200).json({ message: `Success` });
});

module.exports = router;
