const mongoose = require("mongoose");

const followSchema = mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorFollowed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

followSchema.index(
  {
    follower: 1,
    authorFollowed: 1,
  },
  { unique: true },
);

module.exports =
  mongoose.models.Follow || mongoose.model("Follow", followSchema);
