const Post = require("../Models/post");
const Follow = require("../Models/follow");
const Notification = require("../Models/notification");
const User = require("../Models/user");
const Bookmark = require("../Models/bookmark");
const { emitToOneUser } = require("../config/socket");
const mongoose = require("mongoose");

module.exports.postAdder = async (req, res) => {
  const { content } = req.body;
  const author = req.user._id;
  try {
    const post = await Post.create({
      content,
      author,
    });

    const follows = await Follow.find({ authorFollowed: author }).lean();

    const followers = follows.map((follow) => follow.follower);

    const authorData = await User.findById(author);

    const notifs = followers.map((follower) => ({
      notifType: "NEW_POST",
      sender: author,
      targetId: post._id,
      targetType: "Post",
      reciever: follower,
    }));

    await Notification.insertMany(notifs);

    followers.forEach((follower) => {
      emitToOneUser(follower, "notification-add", {
        notifType: "NEW_POST",
        sender: {
          _id: authorData._id,
          profilePic: authorData.profilePic,
          username: authorData.username,
        },
        targetId: post._id,
        targetType: "Post",
        reciever: follower,
      });
    });

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (err) {
    console.error("ERROR:", err.message); // ← this will tell us exactly what's wrong
    res.status(500).json({ error: err.message });
  }
};

module.exports.postGetOfOneUser = async (req, res) => {
  const userId = req.user?._id ? req.user._id : null;
  try {
    const posts = await Post.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(req.params.userId) } },
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
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "bookmarks",
          localField: "_id",
          foreignField: "post",
          as: "bookmarks",
        },
      },
      {
        $addFields: {
          isBookmarked: userId
            ? {
                $in: [
                  userId,
                  { $map: { input: "$bookmarks", as: "b", in: "$$b.user" } },
                ],
              }
            : false,
        },
      },

      {
        $project: {
          "author.email": 0,
          "author.password": 0,
          "reactions._id": 0,
          "reactions.targetId": 0,
          "reactions.targetType": 0,
          bookmarks: 0,
        },
      },
    ]);

    console.log(posts);

    res.status(200).json({ posts });
  } catch (err) {
    console.log("ERROR....", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAllPosts = async (req, res) => {
  const userId = req.user?._id ? req.user._id : null;
  console.log("userId:", userId, typeof userId);
  const posts = await Post.aggregate([
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
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },

    {
      $lookup: {
        from: "bookmarks",
        localField: "_id",
        foreignField: "post",
        as: "bookmarks",
      },
    },
    {
      $addFields: {
        isBookmarked: userId
          ? {
              $in: [
                userId,
                { $map: { input: "$bookmarks", as: "b", in: "$$b.user" } },
              ],
            }
          : false,
      },
    },
    {
      $project: {
        "author.email": 0,
        "author.password": 0, // exclude password
        "reactions._id": 0, // exclude reaction's _id
        "reactions.targetId": 0, // exclude targetId
        "reactions.targetType": 0,
        // bookmarks: 0,
      },
    },
  ]);
  console.log(JSON.stringify(posts[0].bookmarks, null, 2));

  res.status(200).json({ posts });
};

module.exports.getASinglePost = async (req, res) => {
  const userId = req.user?._id ? req.user._id : null;
  try {
    const result = await Post.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.postId) } },
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
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "bookmarks",
          localField: "_id",
          foreignField: "post",
          as: "bookmarks",
        },
      },
      {
        $addFields: {
          isBookmarked: userId
            ? {
                $in: [
                  userId,
                  { $map: { input: "$bookmarks", as: "b", in: "$$b.user" } },
                ],
              }
            : false,
        },
      },
      {
        $project: {
          "author.email": 0,
          "author.password": 0,
          "reactions._id": 0,
          "reactions.targetId": 0,
          "reactions.targetType": 0,
          bookmarks: 0,
        },
      },
    ]);

    if (!result.length)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post: result[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
