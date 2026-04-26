const Bookmark = require("../Models/bookmark");
const Post = require("../Models/post");
const mongoose = require("mongoose");

module.exports.allBookmarksGetter = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const bookmarkedPosts = await Bookmark.aggregate([
      //only this user's bookmarks
      { $match: { user: userId } },

      //sort by bookmark time
      { $sort: { createdAt: -1 } },

      //join post
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },
      { $unwind: "$post" },

      //join author
      {
        $lookup: {
          from: "users",
          localField: "post.author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },

      //embed author inside post
      {
        $addFields: {
          "post.author": "$author",
          "post.isBookmarked": true,
        },
      },

      //return only post
      {
        $replaceRoot: { newRoot: "$post" },
      },

      //remove sensitive fields
      {
        $project: {
          "author.password": 0,
          "author.email": 0,
        },
      },
    ]);

    res.status(200).json({ bookmarkedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.createBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.create({
      user: req.user._id,
      post: req.params.postId,
    });
    res.status(201).json({ message: "Bookmark created" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already bookmarked" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteBookmark = async (req, res) => {
  try {
    const result = await Bookmark.findOneAndDelete({
      user: req.user._id,
      post: req.params.postId,
    });
    if (!result) return res.status(404).json({ message: "Bookmark not found" });
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
