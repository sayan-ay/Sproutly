const mongoose = require("mongoose");
const { Types } = require("mongoose");

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true },
);

module.exports = mongoose.models.Post || mongoose.model("Post", postSchema);
