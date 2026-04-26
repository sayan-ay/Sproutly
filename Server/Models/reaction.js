const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: true,
    },

    targetType: {
      type: String,
      enum: ["Post", "Comment"],
      required: true,
    },

    reaction: {
      type: String,
      enum: ["LIKE", "DISLIKE"],
      required: true,
    },
  },
  { timestamps: true },
);

reactionSchema.index(
  {
    targetId: 1,
    userId: 1,
    targetType: 1,
  },
  { unique: true },
);

module.exports =
  mongoose.models.Reaction || mongoose.model("Reaction", reactionSchema);
