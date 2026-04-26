const Comment = require("../Models/comment");
const Notification = require("../Models/notification");
const Post = require("../Models/post");
const { emitToOneUser } = require("../config/socket");
const mongoose = require("mongoose");

module.exports.commentAddToPost = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      onWhichPost: req.params.postid,
      commentedBy: req.user._id,
    });

    const post = await Post.findById(req.params.postid).select("author");

    if (req.user._id.toString() !== post.author.toString()) {
      const notif = await Notification.create({
        reciever: post.author,
        sender: req.user._id,
        notifType: "COMMENT_ON_POST",
        targetId: req.params.postid,
        targetType: "Post",
        commentId: comment._id,
      });

      const payload = await Notification.findById(notif._id)
        .populate({ path: "sender", select: "-email -password -bio -fullname" })
        .select("-reciever")
        .lean();

      emitToOneUser(post.author.toString(), "notification-add", payload);
    }

    res.status(201).json({ message: "comment successfully added" });
  } catch (err) {
    console.log("Error while comment");
    res.json({ error: err.message });
  }
};

module.exports.getCommentsOfOnePost = async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      {
        $match: { onWhichPost: new mongoose.Types.ObjectId(req.params.postid) },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "targetId",
          as: "reactions",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "commentedBy",
          foreignField: "_id",
          as: "commentedBy",
        },
      },
      { $unwind: "$commentedBy" },
      {
        $project: {
          "commentedBy.email": 0,
          "commentedBy.password": 0,
          "reactions._id": 0,
          "reactions.targetId": 0,
          "reactions.targetType": 0,
        },
      },
    ]);

    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCommentsOfOneUser = async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      {
        $match: { commentedBy: new mongoose.Types.ObjectId(req.params.userid) },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "targetId",
          as: "reactions",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "commentedBy",
          foreignField: "_id",
          as: "commentedBy",
        },
      },
      { $unwind: "$commentedBy" },
      {
        $project: {
          "commentedBy.email": 0,
          "commentedBy.password": 0,
          "reactions._id": 0,
          "reactions.targetId": 0,
          "reactions.targetType": 0,
        },
      },
    ]);

    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
