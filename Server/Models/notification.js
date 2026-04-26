const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    notifType: {
      type: String,
      enum: [
        "COMMENT_ON_POST", // commented on post or comment
          "COMMENT_ON_COMMENT",
        "LIKE", //liked post or comment
        "DISLIKE", //disliked post or comment

        "FOLLOW", //followed u
        "NEW_POST", //new post from people u follow
      ],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: true,
    },
      commentId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
          default:null,
      },
    targetType: {
      type: String,
      enum: ["Post", "User"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
