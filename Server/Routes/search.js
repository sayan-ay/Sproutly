const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const Post = require("../Models/post");

router.get("/", async (req, res) => {
  const { input } = req.query;
  const escapedInput = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const [userNameRegexResults, fullNameTextIndexResults] = await Promise.all([
    User.find({
      username: { $regex: `^${escapedInput}`, $options: "i" },
    })
      .select("username fullName profilePic")
      .lean(),

    User.find(
      { $text: { $search: escapedInput } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .select("fullName profilePic username")
      .lean(),
  ]);

  const postResults = await Post.aggregate([
    {
      $search: {
        index: "post_search_index",
        text: {
          query: input,
          path: "content",
          fuzzy: {
            maxEdits: 2,
            prefixLength: 2,
          },
        },
        highlight: {
          path: "content",
        },
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
    {
      $unwind: "$author",
    },
    {
      $project: {
        "author.username": 1,
        "author.profilePic": 1,
        content: 1,
        score: { $meta: "searchScore" },
        highlights: {
          $sortArray: {
            input: { $meta: "searchHighlights" },
            sortBy: { score: -1 },
          },
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: 5 },
  ]);

  return res.status(200).json({
    users: [...fullNameTextIndexResults, ...userNameRegexResults],
    posts: postResults,
  });
});

module.exports = router;
