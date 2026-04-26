const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    onWhichPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
